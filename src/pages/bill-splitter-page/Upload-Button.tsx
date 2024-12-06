import React, { useState } from 'react';

interface FileUploadProps {
  billId: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ billId }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      const response = await fetch(`http://3.137.160.197:8000//bills/${billId}/receipt`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUploadStatus(`Success: ${data.message}`);
      } else {
        const errorData = await response.json();
        setUploadStatus(`Error: ${errorData.error}`);
      }
    } catch (error) {
      setUploadStatus('Error uploading the file. Please try again.');
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