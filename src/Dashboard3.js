import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Alert, Container, Nav, Navbar } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faRightToBracket, faAddressCard, faHome, faUserClock, faSearch, faEye } from "@fortawesome/free-solid-svg-icons";

const Dashboard3 = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false); // Modal state for image
  const [imagePath, setImagePath] = useState(""); // State to hold image path
  const [search, setSearch] = useState(''); // Search query state

  // Ambil username dan role dari localStorage
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  if (!username) {
    navigate("/"); // Redirect to login page if not logged in
  }else if (role != 2) {
    navigate("/dashboard1"); // Redirect to login page if not logged in
  }

  const dashboard1 = () => {
    navigate("/dashboard1");
  };

  const dashboard3 = () => {
    navigate("/dashboard3");
  };

  const dashboard2 = () => {
    navigate("/dashboard2");
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    navigate("/");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/getData");
        const result = await response.json();

        if (response.ok && result.success) {
          setData(result.data);
          setError("");
        } else {
          setError(result.message || "Failed to fetch data.");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtered data based on the search query
  const filteredData = data.filter(row => {
    return (
      row.username.toLowerCase().includes(search.toLowerCase()) ||
      row.tanggal.toLowerCase().includes(search.toLowerCase()) ||
      row.waktu.toLowerCase().includes(search.toLowerCase())
    );
  });

  const columns = [
    {
      name: "User Name",
      selector: (row) => row.username,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => row.tanggal,
      sortable: true,
    },
    {
      name: "Time",
      selector: (row) => row.waktu,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <Button variant="primary" onClick={() => handleViewImage(row)}>
          View <FontAwesomeIcon icon={faEye} />
        </Button>
      ),
    },
  ];

  // Open modal and display image
  const handleViewImage = (row) => {
    setImagePath(row.image_name);
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => setShowModal(false);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div style={{ display: "flex", height: "100vh"  }}>
      {/* Sidebar */}
      <div
        style={{
          width: "250px",
          backgroundColor: "#343a40",
          height: "100vh",
          color: "white",
          paddingTop: "20px",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        <h3
          style={{
            backgroundColor: "#343a40",
            padding: "10px",
            textAlign: "center",
            margin: 0,
          }}
        >
          HRD Online
        </h3>
        <Nav className="flex-column" style={{ paddingLeft: "10px", paddingTop: "10px" }}>
          <Nav.Link onClick={dashboard1} style={{ color: "white" }}>
            <FontAwesomeIcon icon={faHome} /> Home
          </Nav.Link>
          {role === "2" && (
            <>
              <Nav.Link onClick={dashboard2} style={{ color: "white" }}>
                <FontAwesomeIcon icon={faAddressCard} /> Employee
              </Nav.Link>
              <Nav.Link onClick={dashboard3} style={{ color: "white" }}>
                <FontAwesomeIcon icon={faUserClock} /> Attendance
              </Nav.Link>
            </>
          )}
        </Nav>
      </div>

      {/* Main content */}
      <div style={{ flex: 1 , height: "100vh", overflow: "auto"  }}>
        {/* Header */}
        <Navbar bg="dark" variant="dark" sticky="top">
          <Container>
            <Navbar.Text style={{ color: "white" }}>Welcome, {username}</Navbar.Text>
            <Button variant="danger" onClick={handleLogout} className="ml-auto">
              Logout <FontAwesomeIcon icon={faRightToBracket} />
            </Button>
          </Container>
        </Navbar>

        <div
          style={{
            backgroundColor: "#deebff",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="bg-white shadow-lg rounded-lg p-4 w-100" style={{ maxWidth: "1200px" }}>
            <h2 className="text-center mb-4">Employee Attendance</h2>

            {error && <Alert variant="danger">{error}</Alert>}

            {/* Search Bar */}
            <div
            className="mb-3 d-flex align-items-center"
            style={{
                justifyContent: "flex-end", // Aligns to the right
                gap: "8px", // Adds spacing between the input and icon
            }}
            >
            <Form.Control
                type="text"
                placeholder="Search"
                value={search}
                onChange={handleSearchChange}
                style={{
                maxWidth: "250px",
                }}
            />
            <FontAwesomeIcon icon={faSearch} />
            </div>


            {loading ? (
              <p className="text-center">Loading data...</p>
            ) : (
              <DataTable
                columns={columns}
                data={filteredData} // Display filtered data
                pagination
                highlightOnHover
                striped
              />
            )}

            {/* Modal to show image */}
            <Modal show={showModal} onHide={handleCloseModal}>
              <Modal.Header closeButton>
                <Modal.Title>Attendance Image</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {imagePath ? (
                  <img
                    src={`http://127.0.0.1:8000/storage/uploads/${imagePath}`}
                    alt="Preview"
                    style={{ width: "100%", height: "auto" }}
                  />
                ) : (
                  <p>No image available.</p>
                )}
              </Modal.Body>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard3;
