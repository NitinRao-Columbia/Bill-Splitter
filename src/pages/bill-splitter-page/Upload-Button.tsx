import React, { useState } from 'react';
import axios from 'axios';
import { AxiosResponse } from 'axios';

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
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.status === 202) {
        setUploadStatus('Success: Receipt processed successfully');
        setFile(null); // Reset file input after successful upload
  
        // Wait for the backend to process the receipt
        setTimeout(() => {
          onUploadSuccess(); // Fetch receipt details after delay
        }, 2000); // 2-second delay
      } else {
        setUploadStatus(`Error: ${response.data.error || 'Failed to upload file.'}`);
      }
    } catch (error) {
      setUploadStatus(`Error uploading the file: ${error.message || 'Please try again.'}`);
    }
  };
  

  const fetchReceiptDetails = async () => {
    try {
      const timestamp = new Date().getTime(); // Generate a unique timestamp
      const response = await axios.get<ReceiptItem[]>(
        `http://3.137.160.197:8000/bills/${billId}/items?timestamp=${timestamp}`
      );
  
      if (response.data && response.data.length > 0) {
        setReceiptDetails(response.data); // Update state with fetched data
      } else {
        setReceiptDetails([]); // Clear state if no data
      }
    } catch (error: any) {
      setError(`Failed to fetch receipt details: ${error.response?.data?.message || error.message || 'Unknown error'}`);
      console.error('Error fetching receipt details:', error);
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
