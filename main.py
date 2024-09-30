from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

# Define a request model
class BillSplitRequest(BaseModel):
    total_bill: float
    number_of_people: int

# Define a response model
class BillSplitResponse(BaseModel):
    per_person: float

# Route to handle bill splitting
@app.post("/split-bill", response_model=BillSplitResponse)
def split_bill(request: BillSplitRequest):
    if request.number_of_people <= 0:
        return {"per_person": 0}
    per_person_amount = request.total_bill / request.number_of_people
    return BillSplitResponse(per_person=round(per_person_amount, 2))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
