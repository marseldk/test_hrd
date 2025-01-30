import React, { useState, useEffect, useRef } from "react";
import { Button, Form, Alert, Container, Row, Col, Nav, Navbar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faRightToBracket, faAddressCard, faHome, faUserClock } from "@fortawesome/free-solid-svg-icons";

const Dashboard1 = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentDate, setCurrentDate] = useState(""); // State untuk menyimpan tanggal dan jam
  const fileInputRef = useRef(null);

  // Ambil username dan role dari localStorage
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  // Jika username tidak ada, arahkan kembali ke halaman login
  if (!username) {
    navigate("/"); // Redirect to login page if not logged in
  }

  // Mengupdate tanggal dan jam setiap detik
  useEffect(() => {
    const interval = setInterval(() => {
      const date = new Date();
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const currentDay = date.toLocaleDateString('en-US', options);
      const currentTime = date.toTimeString().split(' ')[0]; // Jam dalam format HH:MM:SS
      setCurrentDate(`${currentDay}, ${currentTime}`);
    }, 1000); // Update setiap detik

    return () => clearInterval(interval); // Membersihkan interval saat komponen di-unmount
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ambil tanggal dan jam saat ini
    const date = new Date();
    const todayDate = date.toISOString().split("T")[0]; // YYYY-MM-DD
    const time = date.toTimeString().split(" ")[0]; // HH:MM:SS

    if (!file) {
      setError("Image is required.");
      return;
    }

    const formData = new FormData();
    formData.append("username", username); // Ambil username dari localStorage
    formData.append("tanggal", todayDate);
    formData.append("jam", time);
    formData.append("image", file); // Menambahkan file gambar

    try {
      const response = await fetch("http://127.0.0.1:8000/api/absen", {
        method: "POST",
        body: formData, // Kirimkan FormData ke API
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(result.message);
        setError("");
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("An error occurred while submitting absen.");
    }

    // Bersihkan file setelah submit
    setFile(null); // Set file state menjadi null
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Bersihkan input file di DOM
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("username"); // Hapus username dari localStorage
    localStorage.removeItem("role");
    navigate("/"); // Kembali ke halaman login
  };

  const dashboard2 = () => {
    navigate("/dashboard2"); // ke halaman dashboard2
  };

  const dashboard1 = () => {
    navigate("/dashboard1"); // ke halaman dashboard2
  };

  const dashboard3 = () => {
    navigate("/dashboard3"); // ke halaman dashboard2
  };

  // Menghilangkan error setelah 3 detik
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 3000);
      return () => clearTimeout(timer); // Membersihkan timer
    }
  }, [error]);

  // Menghilangkan success setelah 3 detik
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess("");
      }, 3000);
      return () => clearTimeout(timer); // Membersihkan timer
    }
  }, [success]);

  return (
    <div style={{ display: "flex", height: "100vh"  }}>
    {/* Sidebar */}
    <div
        style={{
        width: "250px",
        backgroundColor: "#343a40", // Darker background for sidebar to match navbar
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
            backgroundColor: "#343a40", // Same background color as navbar
            padding: "10px",
            textAlign: "center",
            margin: 0, // Remove default margin to align properly
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
    <div style={{ flex: 1, height: "100vh", overflow: "auto"  }}>
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
            // background: "linear-gradient(to right, #006400, #32CD32)", // Hijau gelap ke hijau terang
            backgroundColor: "#deebff",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }}
        >
            <div className="bg-white shadow-lg rounded-lg p-4 w-100 h-100" style={{ maxWidth: "800px", maxHeight: "325px" }}>
                <h2 className="text-center">Attendance</h2>
                <p className="text-center">{currentDate}</p>

                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                <Form onSubmit={handleSubmit}>
                <Form.Group controlId="file" className="mt-3 mb-3">
                    <Form.Label>Upload Image</Form.Label>
                    <Form.Control
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    required
                    />
                </Form.Group>

                <Button variant="primary" type="submit" block className="mt-3">
                    Submit <FontAwesomeIcon icon={faSave} />
                </Button>
                </Form>
            </div>
        </div>
    </div>
    </div>

  );
};

export default Dashboard1;
