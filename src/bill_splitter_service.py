import os
import time
from threading import Thread
from typing import Optional
from dotenv import load_dotenv
from flask import Flask, request, jsonify, make_response, url_for, g
from flask_swagger import swagger
from flask_swagger_ui import get_swaggerui_blueprint
from db import DB
from pydantic import BaseModel, ValidationError
from uuid import uuid4
from PIL import Image
from flask_cors import CORS
from google.cloud import vision
from receipt_reader import extract_text_from_image, parse_receipt_text

load_dotenv()

app = Flask(__name__)
CORS(app)
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = os.path.expanduser('~/igneous-aleph-394703-550f3acb3017.json')

# Database connection setup
db = DB(
    host=os.getenv("DB_HOST"),
    port=int(os.getenv("DB_PORT")),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    database=os.getenv("DB_NAME")
)

# Pydantic models for request and response validation
class BillBase(BaseModel):
    bill_name: Optional[str]
    total_amount: Optional[float]
    created_at: Optional[str]

class BillCreate(BillBase):
    bill_name: str
    total_amount: float

class BillUpdate(BillBase):
    pass

class BillItemBase(BaseModel):
    item_name: Optional[str]
    quantity: Optional[int]
    price: Optional[float]

class BillItemCreate(BillItemBase):
    item_name: str
    quantity: int
    price: float

class BillItemUpdate(BillItemBase):
    pass

class BillParticipantBase(BaseModel):
    user_id: Optional[str]
    amount_paid: Optional[float] = 0.0
    amount_owed: Optional[float] = 0.0
    created_at: Optional[str]

class BillParticipantCreate(BillParticipantBase):
    user_id: str

class BillParticipantUpdate(BillParticipantBase):
    pass

# Middleware for starting a timer before handling a request
@app.before_request
def start_timer():
    """Start a timer before handling a request."""
    g.start = time.time()

# Middleware for logging request details after the response is generated
@app.after_request
def log_request(response):
    """Log the request details after the response is generated."""
    duration = time.time() - g.start
    request_details = f"{request.method} {request.path} - Status: {response.status_code} - Duration: {duration:.4f}s"
    print(request_details)  # For production, use a proper logging mechanism
    return response

@app.route("/")
def healthcheck():
    """Health check endpoint.
    ---
    responses:
      200:
        description: Health check response
    """
    return make_response("<h1>Bill Splitter Microservice</h1>", 200)

@app.route("/swagger")
def swagger_spec():
    """
    Generate Swagger documentation.
    """
    swag = swagger(app)
    swag['info'] = {
        "title": "Bills With Friends",  # Update the title here
        "version": "1.0.0",            # Specify the version
        "description": "An API to manage and split bills among participants."
    }
    swag['definitions'] = {
        "Bill": {
            "type": "object",
            "properties": {
                "bill_id": {"type": "string"},
                "bill_name": {"type": "string"},
                "total_amount": {"type": "number"},
                "created_at": {"type": "string", "format": "date-time"}
            }
        },
        "BillCreate": {
            "type": "object",
            "properties": {
                "bill_name": {"type": "string"},
                "total_amount": {"type": "number"}
            },
            "required": ["bill_name", "total_amount"]
        },
        "BillUpdate": {
            "type": "object",
            "properties": {
                "bill_name": {"type": "string"},
                "total_amount": {"type": "number"}
            }
        },
        "BillItem": {
            "type": "object",
            "properties": {
                "item_id": {"type": "string"},
                "bill_id": {"type": "string"},
                "item_name": {"type": "string"},
                "quantity": {"type": "integer"},
                "price": {"type": "number"}
            }
        },
        "BillItemCreate": {
            "type": "object",
            "properties": {
                "item_name": {"type": "string"},
                "quantity": {"type": "integer"},
                "price": {"type": "number"}
            },
            "required": ["item_name", "quantity", "price"]
        },
        "BillParticipant": {
            "type": "object",
            "properties": {
                "participant_id": {"type": "string"},
                "bill_id": {"type": "string"},
                "user_id": {"type": "string"},
                "amount_paid": {"type": "number"},
                "amount_owed": {"type": "number"},
                "created_at": {"type": "string", "format": "date-time"}
            }
        },
        "BillParticipantCreate": {
            "type": "object",
            "properties": {
                "user_id": {"type": "string"},
                "amount_paid": {"type": "number"},
                "amount_owed": {"type": "number"}
            },
            "required": ["user_id"]
        }
    }
    return jsonify(swag)



# Routes for managing bills
@app.route("/bills", methods=["GET"])
def get_bills():
    """
    Fetch a list of bills with optional query parameters.
    ---
    tags:
      - Bills
    parameters:
      - name: bill_name
        in: query
        type: string
        required: false
        description: Filter bills by name
      - name: skip
        in: query
        type: integer
        required: false
        description: Number of records to skip
      - name: limit
        in: query
        type: integer
        required: false
        description: Maximum number of records to return
    responses:
      200:
        description: A list of bills
        schema:
          type: array
          items:
            $ref: '#/definitions/Bill'
    """
    bill_name = request.args.get("bill_name")
    skip = int(request.args.get("skip", 0))
    limit = int(request.args.get("limit", 10))

    filters = {k: v for k, v in {"bill_name": bill_name}.items() if v}
    bills = db.select("Bills", rows=[], filters=filters, limit=limit, offset=skip)
    
    for bill in bills:
        bill["total_amount"] = float(bill["total_amount"])
    
    return jsonify(bills), 200

@app.route("/bills/<bill_id>", methods=["GET"])
def get_bill(bill_id: str):
    """Fetch a single bill by ID.
    ---
    tags:
      - Bills
    parameters:
      - name: bill_id
        in: path
        type: string
        required: true
        description: The ID of the bill to fetch
    responses:
      200:
        description: The requested bill
        schema:
          $ref: '#/definitions/Bill'
      404:
        description: Bill not found
    """
    bills = db.select("Bills", rows=[], filters={"bill_id": bill_id})
    if not bills:
        return jsonify({"detail": "Bill not found"}), 404

    bill = bills[0]
    return jsonify(bill), 200

@app.route("/bills", methods=["POST"])
def create_bill():
    """Create a new bill.
    ---
    tags:
      - Bills
    parameters:
      - name: bill
        in: body
        required: true
        schema:
          $ref: '#/definitions/BillCreate'
    responses:
      201:
        description: Bill created successfully
        schema:
          $ref: '#/definitions/Bill'
      400:
        description: Validation error
    """
    try:
        bill_data = BillCreate(**request.json)
    except ValidationError as e:
        return jsonify(e.errors()), 400

    bill_dict = bill_data.dict()
    bill_dict["bill_id"] = str(uuid4()).replace("-", "")
    bill_dict["created_at"] = time.strftime('%Y-%m-%d %H:%M:%S')

    # Insert into Bills table
    db.insert("Bills", {
        "bill_id": bill_dict["bill_id"],
        "bill_name": bill_dict["bill_name"],
        "total_amount": bill_dict["total_amount"],
        "created_at": bill_dict["created_at"]
    })

    print(f"Bill created: {bill_dict}")  # Print created bill details
    headers = {"Location": url_for("get_bill", bill_id=bill_dict["bill_id"])}
    return make_response(jsonify(bill_dict), 201, headers)

@app.route("/bills/<bill_id>", methods=["PUT"])
def update_bill(bill_id: str):
    """Update an existing bill.
    ---
    tags:
      - Bills
    parameters:
      - name: bill_id
        in: path
        type: string
        required: true
        description: The ID of the bill to update
      - name: bill
        in: body
        required: true
        schema:
          $ref: '#/definitions/BillUpdate'
    responses:
      200:
        description: Bill updated successfully
        schema:
          $ref: '#/definitions/Bill'
      404:
        description: Bill not found
      400:
        description: Validation error or no valid fields provided for update
    """
    try:
        bill_update_data = BillUpdate(**request.json)
    except ValidationError as e:
        return jsonify(e.errors()), 400

    existing_bill = db.select("Bills", rows=[], filters={"bill_id": bill_id})
    if not existing_bill:
        return jsonify({"detail": "Bill not found"}), 404

    # Extract update data
    update_data = {k: v for k, v in bill_update_data.dict(exclude_unset=True).items() if v is not None}

    # Check if update_data is empty
    if not update_data:
        return jsonify({"detail": "No valid fields provided for update"}), 400

    db.update("Bills", update_data, filters={"bill_id": bill_id})

    # Fetch updated bill data
    updated_bill = db.select("Bills", rows=[], filters={"bill_id": bill_id})[0]

    return jsonify(updated_bill), 200

@app.route("/bills/<bill_id>", methods=["DELETE"])
def delete_bill(bill_id: str):
    """Delete a bill by ID.
    ---
    tags:
      - Bills
    parameters:
      - name: bill_id
        in: path
        type: string
        required: true
        description: The ID of the bill to delete
    responses:
      204:
        description: Bill deleted successfully
      404:
        description: Bill not found
    """
    existing_bill = db.select("Bills", rows=[], filters={"bill_id": bill_id})
    if not existing_bill:
        return jsonify({"detail": "Bill not found"}), 404

    db.delete("Bills", filters={"bill_id": bill_id})
    print(f"Bill deleted: {existing_bill}")  # Print deleted bill details
    return "", 204

# Routes for managing bill items

@app.route("/bills/<bill_id>/items", methods=["GET"])
def get_bill_items(bill_id: str):
    """Fetch items associated with a bill.
    ---
    tags:
      - Bill Items
    parameters:
      - name: bill_id
        in: path
        type: string
        required: true
        description: The ID of the bill to fetch items for
    responses:
      200:
        description: A list of items associated with the bill
        schema:
          type: array
          items:
            $ref: '#/definitions/BillItem'
      404:
        description: Bill not found
    """
    existing_bill = db.select("Bills", rows=[], filters={"bill_id": bill_id})
    if not existing_bill:
        return jsonify({"detail": "Bill not found"}), 404

    items = db.select("Bill_Items", rows=[], filters={"bill_id": bill_id})
    return jsonify(items), 200

@app.route("/bills/<bill_id>/items", methods=["POST"])
def create_bill_item(bill_id: str):
    """Create an item for a bill.
    ---
    tags:
      - Bill Items
    parameters:
      - name: bill_id
        in: path
        type: string
        required: true
        description: The ID of the bill to add an item to
      - name: item
        in: body
        required: true
        schema:
          $ref: '#/definitions/BillItemCreate'
    responses:
      201:
        description: Bill item created successfully
        schema:
          $ref: '#/definitions/BillItem'
      404:
        description: Bill not found
      400:
        description: Validation error
    """
    existing_bill = db.select("Bills", rows=[], filters={"bill_id": bill_id})
    if not existing_bill:
        return jsonify({"detail": "Bill not found"}), 404

    try:
        item_data = BillItemCreate(**request.json)
    except ValidationError as e:
        return jsonify(e.errors()), 400

    item_dict = item_data.dict()
    item_dict["bill_id"] = bill_id

    # Insert into Bill_Items table
    db.insert("Bill_Items", {
        "bill_id": item_dict["bill_id"],
        "item_name": item_dict["item_name"],
        "quantity": item_dict["quantity"],
        "price": item_dict["price"]
    })

    print(f"Bill item created: {item_dict}")  # Print created item details
    return make_response(jsonify(item_dict), 201)

@app.route("/bills/<bill_id>/items/<item_id>", methods=["PUT"])
def update_bill_item(bill_id: str, item_id: str):
    """Update an item of a bill.
    ---
    tags:
      - Bill Items
    parameters:
      - name: bill_id
        in: path
        type: string
        required: true
        description: The ID of the bill containing the item
      - name: item_id
        in: path
        type: string
        required: true
        description: The ID of the item to update
      - name: item
        in: body
        required: true
        schema:
          $ref: '#/definitions/BillItemUpdate'
    responses:
      200:
        description: Bill item updated successfully
        schema:
          $ref: '#/definitions/BillItem'
      404:
        description: Item not found
      400:
        description: Validation error or no valid fields provided for update
    """
    try:
        item_update_data = BillItemUpdate(**request.json)
    except ValidationError as e:
        return jsonify(e.errors()), 400

    existing_item = db.select("Bill_Items", rows=[], filters={"bill_id": bill_id, "item_id": item_id})
    if not existing_item:
        return jsonify({"detail": "Item not found"}), 404

    # Extract update data
    update_data = {k: v for k, v in item_update_data.dict(exclude_unset=True).items() if v is not None}

    # Check if update_data is empty
    if not update_data:
        return jsonify({"detail": "No valid fields provided for update"}), 400

    db.update("Bill_Items", update_data, filters={"bill_id": bill_id, "item_id": item_id})

    # Fetch updated item data
    updated_item = db.select("Bill_Items", rows=[], filters={"bill_id": bill_id, "item_id": item_id})[0]

    return jsonify(updated_item), 200

@app.route("/bills/<bill_id>/items/<item_id>", methods=["DELETE"])
def delete_bill_item(bill_id: str, item_id: str):
    """Delete an item from a bill.
    ---
    tags:
      - Bill Items
    parameters:
      - name: bill_id
        in: path
        type: string
        required: true
        description: The ID of the bill containing the item
      - name: item_id
        in: path
        type: string
        required: true
        description: The ID of the item to delete
    responses:
      204:
        description: Bill item deleted successfully
      404:
        description: Item not found
    """
    existing_item = db.select("Bill_Items", rows=[], filters={"bill_id": bill_id, "item_id": item_id})
    if not existing_item:
        return jsonify({"detail": "Item not found"}), 404

    db.delete("Bill_Items", filters={"bill_id": bill_id, "item_id": item_id})
    print(f"Bill item deleted: {existing_item}")  # Print deleted item details
    return "", 204

# Routes for managing bill participants

@app.route("/bills/<bill_id>/participants", methods=["GET"])
def get_bill_participants(bill_id: str):
    """Fetch participants associated with a bill.
    ---
    tags:
      - Bill Participants
    parameters:
      - name: bill_id
        in: path
        type: string
        required: true
        description: The ID of the bill to fetch participants for
    responses:
      200:
        description: A list of participants associated with the bill
        schema:
          type: array
          items:
            $ref: '#/definitions/BillParticipant'
      404:
        description: Bill not found
    """
    existing_bill = db.select("Bills", rows=[], filters={"bill_id": bill_id})
    if not existing_bill:
        return jsonify({"detail": "Bill not found"}), 404

    participants = db.select("Bill_Participants", rows=[], filters={"bill_id": bill_id})
    return jsonify(participants), 200

@app.route("/bills/<bill_id>/participants", methods=["POST"])
def add_bill_participant(bill_id: str):
    """Add a participant to a bill.
    ---
    tags:
      - Bill Participants
    parameters:
      - name: bill_id
        in: path
        type: string
        required: true
        description: The ID of the bill to add a participant to
      - name: participant
        in: body
        required: true
        schema:
          $ref: '#/definitions/BillParticipantCreate'
    responses:
      201:
        description: Participant added successfully
        schema:
          $ref: '#/definitions/BillParticipant'
      404:
        description: Bill not found
      400:
        description: Validation error
    """
    existing_bill = db.select("Bills", rows=[], filters={"bill_id": bill_id})
    if not existing_bill:
        return jsonify({"detail": "Bill not found"}), 404

    try:
        participant_data = BillParticipantCreate(**request.json)
    except ValidationError as e:
        return jsonify(e.errors()), 400

    participant_dict = participant_data.dict()
    participant_dict["bill_id"] = bill_id
    participant_dict["created_at"] = time.strftime('%Y-%m-%d %H:%M:%S')

    # Insert into Bill_Participants table
    db.insert("Bill_Participants", {
        "bill_id": participant_dict["bill_id"],
        "user_id": participant_dict["user_id"],
        "amount_paid": participant_dict.get("amount_paid", 0.0),
        "amount_owed": participant_dict.get("amount_owed", 0.0),
        "created_at": participant_dict["created_at"]
    })

    print(f"Bill participant added: {participant_dict}")  # Print added participant details
    return make_response(jsonify(participant_dict), 201)

@app.route("/bills/<bill_id>/participants/<participant_id>", methods=["PUT"])
def update_bill_participant(bill_id: str, participant_id: str):
    """Update a participant of a bill.
    ---
    tags:
      - Bill Participants
    parameters:
      - name: bill_id
        in: path
        type: string
        required: true
        description: The ID of the bill containing the participant
      - name: participant_id
        in: path
        type: string
        required: true
        description: The ID of the participant to update
      - name: participant
        in: body
        required: true
        schema:
          $ref: '#/definitions/BillParticipantUpdate'
    responses:
      200:
        description: Participant updated successfully
        schema:
          $ref: '#/definitions/BillParticipant'
      404:
        description: Participant not found
      400:
        description: Validation error or no valid fields provided for update
    """
    try:
        participant_update_data = BillParticipantUpdate(**request.json)
    except ValidationError as e:
        return jsonify(e.errors()), 400

    existing_participant = db.select("Bill_Participants", rows=[], filters={"bill_id": bill_id, "id": participant_id})
    if not existing_participant:
        return jsonify({"detail": "Participant not found"}), 404

    # Extract update data
    update_data = {k: v for k, v in participant_update_data.dict(exclude_unset=True).items() if v is not None}

    # Check if update_data is empty
    if not update_data:
        return jsonify({"detail": "No valid fields provided for update"}), 400

    db.update("Bill_Participants", update_data, filters={"bill_id": bill_id, "id": participant_id})

    # Fetch updated participant data
    updated_participant = db.select("Bill_Participants", rows=[], filters={"bill_id": bill_id, "id": participant_id})[0]

    return jsonify(updated_participant), 200

@app.route("/bills/<bill_id>/participants/<participant_id>", methods=["DELETE"])
def delete_bill_participant(bill_id: str, participant_id: str):
    """Remove a participant from a bill.
    ---
    tags:
      - Bill Participants
    parameters:
      - name: bill_id
        in: path
        type: string
        required: true
        description: The ID of the bill containing the participant
      - name: participant_id
        in: path
        type: string
        required: true
        description: The ID of the participant to delete
    responses:
      204:
        description: Participant deleted successfully
      404:
        description: Participant not found
    """
    existing_participant = db.select("Bill_Participants", rows=[], filters={"bill_id": bill_id, "id": participant_id})
    if not existing_participant:
        return jsonify({"detail": "Participant not found"}), 404

    db.delete("Bill_Participants", filters={"bill_id": bill_id, "id": participant_id})
    print(f"Bill participant deleted: {existing_participant}")  # Print deleted participant details
    return "", 204

# Asynchronous operations
@app.route("/bills/<bill_id>/calculate", methods=["POST"])
def calculate_total_async(bill_id: str):
    """Asynchronous calculation of the total cost for a bill.
    ---
    tags:
      - Bills
    parameters:
      - name: bill_id
        in: path
        type: string
        required: true
        description: The ID of the bill to calculate total for
    responses:
      202:
        description: Calculation started
      404:
        description: Bill not found
    """
    existing_bill = db.select("Bills", rows=[], filters={"bill_id": bill_id})
    if not existing_bill:
        return jsonify({"detail": "Bill not found"}), 404

    def calculate_total_task(bill_id: str):
        items = db.select("Bill_Items", rows=["price", "quantity"], filters={"bill_id": bill_id})
        total = sum(item["price"] * item["quantity"] for item in items)
        db.update("Bills", {"total_amount": total}, filters={"bill_id": bill_id})
        print(f"Total calculated for bill {bill_id}: {total}")

    Thread(target=calculate_total_task, args=(bill_id,)).start()
    return jsonify({"detail": "Calculation started"}), 202

# Receipt processing
@app.route('/bills/<bill_id>/receipt', methods=['POST'])
def process_receipt(bill_id):
    """Asynchronous receipt processing for a bill.
    ---
    tags:
      - Bills
    parameters:
      - name: bill_id
        in: path
        type: string
        required: true
        description: The ID of the bill to process receipt for
      - name: file
        in: formData
        required: true
        type: file
        description: The receipt image file to process
    responses:
      202:
        description: Receipt processing started successfully
        schema:
          type: object
          properties:
            detail:
              type: string
      400:
        description: Error in file upload or processing
      500:
        description: Internal server error
    """
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Validate file extension
    if not file.filename.lower().endswith(('jpg', 'jpeg', 'png')):
        return jsonify({'error': 'Invalid file format'}), 400

    def process_receipt_task(bill_id, file_content):
        try:
            # Initialize Google Cloud Vision client
            client = vision.ImageAnnotatorClient()

            # Extract text from the image using the imported function
            extracted_text = extract_text_from_image(client, file_content)

            # Parse the extracted text using the imported function
            receipt_data = parse_receipt_text(extracted_text)

            # Insert parsed items into the database
            for item in receipt_data:
                item_name, quantity, price = item
                if item_name and price is not None:
                    db.insert("Bill_Items", {
                        "bill_id": bill_id,
                        "item_name": item_name,
                        "quantity": quantity or 1,
                        "price": price
                    })
            print(f"Receipt processed for bill {bill_id}")
        except Exception as e:
            print(f"Error in receipt processing for bill {bill_id}: {e}")

    try:
        # Read image content
        file_content = file.read()

        # Start asynchronous task
        Thread(target=process_receipt_task, args=(bill_id, file_content)).start()

        return jsonify({"detail": "Receipt processing started"}), 202
    except Exception as e:
        print(f"Error starting receipt processing: {e}")
        return jsonify({'error': f'Failed to start receipt processing: {str(e)}'}), 500


# Swagger UI setup
SWAGGER_URL = '/swagger-ui'  # URL for Swagger UI
API_URL = '/swagger'         # Existing route for Swagger spec

swaggerui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,  # Swagger UI blueprint endpoint
    API_URL,      # API spec endpoint
    config={
        'app_name': "Bills With Friends"
    }
)

# Register the Swagger UI blueprint
app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)


# Run the Flask app if executed as main
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)