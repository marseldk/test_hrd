import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt  } from "@fortawesome/free-solid-svg-icons";
import Dexa from "./dexa.jpg";

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/api/logon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();
      // console.log(result);
      if (result.success) {
        if (result.role === 1 || result.role === 2) {
          localStorage.setItem("username", username);
          localStorage.setItem("role", result.role);
          navigate("/dashboard1"); // Arahkan ke Dashboard 1
        } else {
          setError("Invalid role. Please contact support."); // Role tidak valid
        }
        // setIsLoggedIn(true);
        setError("");
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setError("An error occurred. Please try again.");
    }
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

  return (
    <div
      style={{
        background: "linear-gradient(to right, #003366, #3399ff)", // Dark blue to light blue gradient
        height: "100vh", // Full height of the screen
        width: "100%", // Full width of the screen
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="shadow-lg bg-white rounded-lg"
        style={{
          display: "flex",
          maxWidth: "800px", // Maximum width for the container
          width: "90%", // Adjust width responsively
          overflow: "hidden",
        }}
      >
        {/* Left: React Logo */}
        <div
          style={{
            backgroundColor: "#f8f9fa", // Light gray background for logo area
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            padding: "20px",
          }}
        >
          <img
            src={Dexa}
            alt="Dexa Logo"
            style={{ maxWidth: "100%", maxHeight: "200px" }} // Responsive logo size
          />
        </div>

        {/* Right: Login Form */}
        <div className="p-4" style={{ flex: 1.5 }}>
          <h2 className="text-center mb-4">Login</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleLogin}>
            <Form.Group controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>
            <br />
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <br />
            <Button variant="primary" type="submit" block>
              Login <FontAwesomeIcon icon={faSignInAlt} />
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default App;
