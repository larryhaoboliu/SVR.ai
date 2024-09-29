import React, { useState } from 'react';
import axios from 'axios';

const ReportForm = () => {
  const [projectName, setProjectName] = useState(''); 
  const [reportNumber, setReportNumber] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState(''); 
  const [action, setAction] = useState('');
  const [photos, setPhotos] = useState([]); // Uploaded photos

  // Handle file changes for photo uploads
  const handleFileChange = (e) => {
    setPhotos([...e.target.files]);
  };

  // Function to generate description using Flask API and GPT-4
  const generateDescription = () => {
    if (photos.length === 0) {
      alert('Please upload photos before generating the description.');
      return;
    }

    const formData = new FormData();
    formData.append('image', photos[0]); // Send only the first image for simplicity

    // Call the Flask API to analyze the image
    fetch('http://localhost:5001/analyze-image', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        if (data.description) {
          setDescription(data.description); // Populate the description field
        } else {
          alert('Error: ' + data.error);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error generating description. Please try again.');
      });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('projectName', projectName);
    formData.append('reportNumber', reportNumber);
    formData.append('subject', subject);
    formData.append('description', description); // User can edit GPT-4's output
    formData.append('action', action);
    photos.forEach((photo, i) => formData.append(`photos`, photo));

    axios.post('/api/reports', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then(response => {
      console.log('Report created successfully:', response.data);
      // Optionally reset the form fields after successful submission
      setProjectName('100 Roy Street');  // Reset to default
      setReportNumber('SV.24');  // Reset to default
      setSubject('');
      setDescription(''); 
      setAction('');
      setPhotos([]);
    })
    .catch(error => {
      console.error('Error creating report:', error);
    });
  };

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleSubmit}>
        {/* Project and report inputs */}
        <div className="form-group">
          <label htmlFor="ProjectName">Project</label>
          <input
            type="text"
            className="form-control"
            id="ProjectName"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="ReportNumber">Report Number</label>
          <input
            type="text"
            className="form-control"
            id="ReportNumber"
            value={reportNumber}
            onChange={(e) => setReportNumber(e.target.value)}
          />
        </div>

        {/* Subject and Description */}
        <div className="form-group">
          <label htmlFor="Subject">Subject</label>
          <input
            type="text"
            className="form-control"
            id="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="Description">Description</label>
          <textarea
            className="form-control"
            id="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {/* Button to generate the description using GPT-4 */}
          <button type="button" className="btn btn-primary mt-2" onClick={generateDescription}>
            Generate Description
          </button>
        </div>

        <div className="form-group">
          <label htmlFor="Action">Action</label>
          <textarea
            className="form-control"
            id="Action"
            value={action}
            onChange={(e) => setAction(e.target.value)}
          />
        </div>

        {/* File input for photos */}
        <div className="form-group">
          <label htmlFor="Photos">Photos</label>
          <input
            type="file"
            className="form-control"
            id="Photos"
            multiple
            onChange={handleFileChange}
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-success">
          Create Report
        </button>
      </form>
    </div>
  );
};

export default ReportForm;
