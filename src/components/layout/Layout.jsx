import React, { useEffect, useState } from 'react';
import Navbar from '../navBar/Navbar';
import AllProjects from '../allProjects/AllProjects';
import Tasks from '../tasks/Tasks';

export default function Layout() {
  const [searchTerm, setSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedTheme);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <>
      <div className="container-fluid mt-2">
        <div className="row d-flex justify-content-center">
          <div className="col-md-1 mb-3">
            <Navbar />
          </div>

          <div className="bg-light col-md-2">
            <AllProjects setSearchTerm={setSearchTerm} />
          </div>

          <div className="bg-light col-md-9">
            <div className="d-flex align-items-baseline justify-content-between">
              <div className="m-2 p-2">
                <h6>WebApp / UI Design / Project</h6>
              </div>

              <div className={`app-container ${darkMode ? "dark" : ""}`}>
                <button
                  className={`btn ${
                    darkMode ? "btn-dark text-white border-light" : "btn-light border-dark"
                  }`}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "50px",
                    fontWeight: "bold",
                    transition: "all 0.3s ease",
                  }}
                  onClick={() => setDarkMode(!darkMode)}
                >
                  {darkMode ? (
                    <>
                      <i className="fas fa-sun me-2 text-warning"></i> Light Mode
                    </>
                  ) : (
                    <>
                      <i className="fas fa-moon me-2 text-dark"></i> Dark Mode
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="p-4 d-flex">
              <h6>Discussion</h6>
              <h6 className="text-info mx-3 border-bottom border-info border-3 pb-1">Tasks</h6>
              <h6 className="mx-3">Timeline</h6>
              <h6 className="mx-3">Files</h6>
              <h6 className="mx-3">Overview</h6>
            </div>

            <div className="custom-bg-grey">
              <Tasks searchTerm={searchTerm} darkMode={darkMode} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}