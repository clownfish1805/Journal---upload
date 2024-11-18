import React, { useState } from "react";
import axios from "axios";
import Header from "./Header";
import "./Upload.css"; // Assuming you use an external CSS file for styling

const Upload = () => {
  const [formData, setFormData] = useState({
    year: "",
    volume: "",
    issue: "",
    title: "",
    content: "",
    data: "",
    link: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Parse 'data' field to JSON if it's an object
    let formattedData = formData.data;
    try {
      formattedData = JSON.parse(formData.data);
    } catch (error) {
      console.error("Error parsing data field. Ensure it is valid JSON.");
    }

    const publicationData = {
      ...formData,
      data: formattedData,
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/publications",
        publicationData
      );
      console.log("Publication submitted:", response.data);
      alert("Publication submitted successfully!");
      setFormData({
        year: "",
        volume: "",
        issue: "",
        title: "",
        content: "",
        data: "",
        link: "",
      });
    } catch (error) {
      console.error("Error submitting publication:", error);
      alert("Failed to submit publication.");
    }
  };

  return (
    <>
      <Header />
      <div className="upload-page-container">
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <label>
                Year:
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Volume:
                <input
                  type="number"
                  name="volume"
                  value={formData.volume}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
            <div className="form-row">
              <label>
                Issue:
                <input
                  type="number"
                  name="issue"
                  value={formData.issue}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Title:
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
            <div className="form-row">
              <label>
                Content:
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
            <div className="form-row">
              <label>
                Date:
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
            <div className="form-row">
              <label>
                Link:
                <input
                  type="url"
                  name="link"
                  value={formData.link}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
        <div className="image-container">
          <h1>one click to update on IJAE</h1>
        </div>
      </div>
    </>
  );
};

export default Upload;
