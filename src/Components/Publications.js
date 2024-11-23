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

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      const filtered = publications.filter((publication) =>
        publication.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPublications(filtered);
    }, 300);

    return () => clearTimeout(timer); // Cleanup on unmount or query change
  }, [searchQuery, publications]);

  const handleDelete = async (id) => {
    if (!id) {
      console.error("Invalid ID:", id);
      alert("Failed to delete. Invalid publication ID.");
      return;
    }

    // Disable the delete button temporarily
    const deleteButton = document.querySelector(`button[data-id="${id}"]`);
    if (deleteButton) deleteButton.disabled = true;

    try {
      const response = await fetch(
        `https://publication-backend-klr9.onrender.com/publications/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Update state to remove deleted publication
        const updatedPublications = publications.filter(
          (publication) => publication.id !== id && publication._id !== id
        );
        setPublications(updatedPublications);
        setFilteredPublications(updatedPublications);

        alert("Publication deleted successfully!");
      } else {
        alert("Failed to delete publication. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting publication:", error);
      alert("An error occurred. Please try again.");
    } finally {
      if (deleteButton) deleteButton.disabled = false;
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
        </div>

        <div>
          {filteredPublications && filteredPublications.length > 0 ? (
            <table className="publication-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Year</th>
                  <th>Volume</th>
                  <th>Content</th>
                  <th>Link</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPublications.map((publication, index) => (
                  <tr key={publication.id || publication._id}>
                    <td>{index + 1}</td>
                    <td>{publication.title}</td>
                    <td>{publication.year}</td>
                    <td>{publication.volume}</td>
                    <td>{publication.content}</td>
                    <td>
                      <a
                        href={publication.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Pdf
                      </a>
                    </td>
                    <td>
                      <button
                        className="delete-button"
                        data-id={publication.id || publication._id}
                        onClick={() =>
                          handleDelete(publication.id || publication._id)
                        }
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
