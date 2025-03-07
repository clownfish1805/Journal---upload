import React, { useEffect, useState } from "react";
import Header from "./Header";
import "./Publications.css";

const Publications = () => {
  const [publications, setPublications] = useState([]); // Ensure it's always an array
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPublications, setFilteredPublications] = useState([]);

  // Fetch publications data from the backend
  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const response = await fetch(
          "https://publication-backend-klr9.onrender.com/publications"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch publications.");
        }

        const data = await response.json();
        console.log("Fetched publications data:", data);

        // Ensure we are only setting an array
        const publicationsArray = Array.isArray(data) ? data : [];
        setPublications(publicationsArray);
        setFilteredPublications(publicationsArray);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Error loading data. Please try again later.");
      }
    };

    fetchPublications();
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (Array.isArray(publications)) {
        const filtered = publications.filter((publication) =>
          publication.title?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredPublications(filtered);
      }
    }, 300);

    return () => clearTimeout(timer); // Cleanup
  }, [searchQuery, publications]);

  // Handle deletion of a publication
  const handleDelete = async (id) => {
    if (!id) {
      console.error("Invalid ID:", id);
      alert("Failed to delete. Invalid publication ID.");
      return;
    }

    try {
      const response = await fetch(
        `https://publication-backend-klr9.onrender.com/publications/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        const updatedPublications = publications.filter(
          (publication) => publication.id !== id && publication._id !== id
        );
        setPublications(updatedPublications);
        setFilteredPublications(updatedPublications);
        alert("Publication deleted successfully!");
      } else {
        alert("Failed to delete the publication.");
      }
    } catch (error) {
      console.error("Error deleting publication:", error);
      alert("An error occurred while attempting to delete.");
    }
  };

  return (
    <>
      <Header />
      <div className="publication-container">
        <h2>Publications of IJEAE</h2>

        {/* Search bar */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-bar"
          />
        </div>

        {/* Display Publications Table */}
        {filteredPublications?.length > 0 ? (
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
                <th>PDF</th>
              </tr>
            </thead>
            <tbody>
              {filteredPublications.map((publication, index) => (
                <tr key={publication.id || publication._id}>
                  <td>{index + 1}</td>
                  <td>{publication.title || "N/A"}</td>
                  <td>{publication.year || "N/A"}</td>
                  <td>{publication.volume || "N/A"}</td>
                  <td>{publication.content || "N/A"}</td>
                  <td>
                    {publication.link ? (
                      <a
                        href={publication.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Pdf
                      </a>
                    ) : (
                      "No link available"
                    )}
                  </td>
                  <td>
                    <button
                      className="delete-button"
                      onClick={() =>
                        window.confirm("Are you sure you want to delete this?")
                          ? handleDelete(publication.id || publication._id)
                          : null
                      }
                    >
                      Delete
                    </button>
                  </td>
                  <td>
                    {publication.link ? (
                      <a
                        href={publication.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <embed src={publication.link} type="application/pdf" />
                      </a>
                    ) : (
                      "No PDF available"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No publications found or still loading...</p>
        )}
      </div>
    </>
  );
};

export default Publications;
