import React, { useState } from "react";
import axios from "axios";
import Header from "./Header";
import "./Upload.css";
import sideimage from "../Assets/sideimage.svg";
import { useNavigate } from "react-router-dom";

const Upload = () => {
  const [formData, setFormData] = useState({
    year: "",
    volume: "",
    issue: "",
    title: "",
    content: "",
    date: "",
    link: "",
    specialIssue: "No",
  });

  const [volumeError, setVolumeError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "volume") {
      const volumeRegex = /^\d+\(\d+\)$/; // Volume format like 1(1)
      if (!volumeRegex.test(value)) {
        setVolumeError("Please follow the format: X(Y) e.g., 1(1)");
      } else {
        setVolumeError("");
      }
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (volumeError) {
      alert("Please fix the errors before submitting.");
      return;
    }

    const publicationData = {
      ...formData,
      isSpecialIssue: formData.specialIssue === "Yes" ? true : false,
    };

    console.log("Data being sent to backend:", publicationData);

    try {
      const response = await axios.post(
        process.env.REACT_APP_BACKEND_URL,
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
        date: "",
        link: "",
        specialIssue: "No",
      });
    } catch (error) {
      console.error("Error submitting publication:", error);
      alert("Failed to submit publication.");
    }
  };

  const handleView = () => {
    navigate("/publications");
  };

  return (
    <>
      <Header />
      <div className="view-container">
        <button onClick={handleView}>View Publications</button>
      </div>
      <div className="upload-page-container">
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <label>
                Year:
                <input
                  type="number"
                  name="year"
                  placeholder="20xx"
                  value={formData.year}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Volume(Issue):
                <input
                  type="text"
                  name="volume"
                  placeholder="1(1)"
                  value={formData.volume}
                  onChange={handleChange}
                  required
                />
              </label>
              {volumeError && <p className="error">{volumeError}</p>}
            </div>

            <div className="form-row">
              <label>
                Special Issue:
                <select
                  name="specialIssue"
                  value={formData.specialIssue}
                  onChange={handleChange}
                  required
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
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
                  placeholder="Title of the Journal"
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
          <h1>One click to update on IJEAE</h1>
          <img src={sideimage} alt="Side illustration" />
        </div>
      </div>
    </>
  );
};

export default Upload;
