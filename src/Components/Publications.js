import React, { useEffect, useState } from "react";
import Header from "./Header";
import "./Publications.css";

const Publications = () => {
  const [publications, setPublications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPublications, setFilteredPublications] = useState([]);

  // Fetch publications data
  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const response = await fetch(
          "https://publication-backend-klr9.onrender.com/publications"
        );
        const data = await response.json();
        setPublications(data);
        setFilteredPublications(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPublications();
  }, []);

  const handleSearch = () => {
    const filtered = publications.filter((publication) =>
      publication.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPublications(filtered);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `https://publication-backend-klr9.onrender.com/publications/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Remove the deleted publication from the state
        const updatedPublications = publications.filter(
          (publication) => publication.id !== id
        );
        setPublications(updatedPublications);

        // Update filtered publications in case of active search
        const updatedFilteredPublications = filteredPublications.filter(
          (publication) => publication.id !== id
        );
        setFilteredPublications(updatedFilteredPublications);

        alert("Publication deleted successfully!");
      } else {
        alert("Failed to delete publication. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting publication:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <div className="publication-container">
        <h2>Publications of IJEAE</h2>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-bar"
          />
          <button onClick={handleSearch} className="search-button">
            Search
          </button>
        </div>

        <div>
          {filteredPublications.length > 0 ? (
            <table className="publication-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Year</th>
                  <th>Volume</th>
                  <th>Content</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPublications.map((publication, index) => (
                  <tr key={publication.id}>
                    <td>{index + 1}</td>
                    <td>{publication.title}</td>
                    <td>{publication.year}</td>
                    <td>{publication.volume}</td>
                    <td>{publication.content}</td>
                    <td>
                      <a href={publication.link}>Pdf</a>
                    </td>
                    <td>
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(publication.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No publications found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Publications;
