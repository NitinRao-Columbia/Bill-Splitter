import React, { useState } from 'react';
import axios from 'axios';

const billId = 'b1f01e23c4d24e1ea6d9a26b5f1556d7';

interface FileUploadProps {
  billId: string;
  onUploadSuccess: () => void;  // Trigger fetching receipt items in parent
}

const FileUpload: React.FC<FileUploadProps> = ({ billId, onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUploadStatus('');  // Clear status on new file selection
    const selectedFile = event.target.files && event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      setUploadStatus('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`http://3.137.160.197:8000/bills/${billId}/receipt`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.status === 200) {
        setUploadStatus('Success: Receipt processed successfully');
        onUploadSuccess();  // Trigger the fetch of receipt details
        setFile(null);  // Reset file input after successful upload
      } else {
        setUploadStatus(`Error: ${response.data.error || 'Failed to upload file.'}`);
      }
    } catch (error) {
      setUploadStatus(`Error uploading the file: ${error.message || 'Please try again.'}`);
    }
  };

  const fetchReceiptDetails = async () => {
    try {
      const response = await axios.get(`http://3.137.160.197:8000/bills/${billId}/items`);
      if (response.data.items) {
        setReceiptDetails(response.data.items);
      } else {
        throw new Error('No receipt details available');
      }
    } catch (error) {
      setError(error.message || 'Failed to fetch receipt details');
    }
  };

  return (
    <div>
      <h3>Upload Receipt</h3>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleFileUpload} disabled={!file}>
        Upload
      </button>
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
};

export default FileUpload;
