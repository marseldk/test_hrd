import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Alert, Container, Nav, Navbar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faRightToBracket, faAddressCard, faHome, faUserClock, faSearch, faPlusSquare, faEdit, faTrashAlt  } from "@fortawesome/free-solid-svg-icons";

const Dashboard2 = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false); // State untuk mengontrol modal
  const [formData, setFormData] = useState({
    nama_user: "",
    gender: 1,
    alamat: "",
    role: 1, // Default ke User
  });
  const [search, setSearch] = useState(''); // Search query state

  // Ambil username dan role dari localStorage
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  
  if (!username) {
    navigate("/"); // Redirect to login page if not logged in
  }else if (role != 2) {
    navigate("/dashboard1"); // Redirect to login page if not logged in
  }

  const dashboard3 = () => {
    navigate("/dashboard3"); //  ke halaman dashboard2
  };


  useEffect(() => {
    const fetchKaryawan = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/getKaryawan");
        const result = await response.json();

        if (response.ok && result.success) {
          setData(result.data);
          setError("");
        } else {
          setError(result.message || "Failed to fetch data from API.");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchKaryawan();
  }, []);

  const columns = [
    {
      name: "ID User",
      selector: (row) => row.id_user,
      sortable: true,
      width: "90px", 
    },
    {
      name: "User Name",
      selector: (row) => row.nama_user,
      sortable: true,
    },
    {
      name: "Role",
      selector: (row) => (row.role === 1 ? "User" : "HRD"),
      sortable: true,
    },
    {
      name: "Gender",
      selector: (row) => (row.gender === 1 ? "Male" : "Female"),
      sortable: true,
    },
    {
      name: "Address",
      selector: (row) => (row.alamat ? row.alamat : "Not Provided"),
      sortable: true,
    },
    {
        name: "Action",
        cell: (row) => (
            <div>
                <Button variant="warning" onClick={() => handleEdit(row)} className="btn-block">
                Edit <FontAwesomeIcon icon={faEdit} />
                </Button>{" "}
                <Button
                    variant="danger"
                    onClick={() => handleDeleteClick(row.id_user)} className="btn-block"
                >
                    Delete <FontAwesomeIcon icon={faTrashAlt} />
                </Button>
            </div>
        ),
      },
  ];

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    navigate("/");
  };

  // Buka atau tutup modal
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () =>{
    // Reset form data
    setFormData({
      nama_user: "",
      gender: 1,
      alamat: "",
      role: 1,
    });
    setShowModal(false);
  }; 

  // Menangani input form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Submit form untuk menambahkan karyawan baru
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Ambil username dari localStorage
    const username = localStorage.getItem("username");

    if (!username) {
        setError("Username is required.");
        return;
    }

    // Tambahkan username ke formData
    const formDataWithUsername = {
        ...formData,    // Menyertakan data form yang sudah ada
        username: username, // Menambahkan username ke formData
    };
    
    try {
      const response = await fetch("http://127.0.0.1:8000/api/addKaryawan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataWithUsername),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccess(result.message);
        setData([...data, result.data]); // Tambahkan data baru ke tabel
        // Kosongkan formData setelah berhasil menambah data
        setFormData({
            nama_user: "",
            role: 1, 
            gender: 1,
            alamat: "",
        });
        setError("");
        setShowModal(false); // Tutup modal
      } else {
        setFormData({
            nama_user: "",
            role: 1, 
            gender: 1,
            alamat: "",
        });
        setError(result.message || "Failed to add new employee.");
        setShowModal(false);
      }
    } catch (err) {
        setFormData({
            nama_user: "",
            role: 1, 
            gender: 1,
            alamat: "",
        });
      console.error("Error adding new employee:", err);
      setError("An error occurred while adding new employee.");
      setShowModal(false); // Tutup modal
    }
  };
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const handleDeleteClick = (id_user) => {
        setDeleteId(id_user);  // Simpan ID user yang akan dihapus
        setShowConfirmModal(true);  // Tampilkan modal konfirmasi
    };
    
    const handleDeleteConfirm = async () => {
        try {
        const response = await fetch(`http://127.0.0.1:8000/api/deleteKaryawan/${deleteId}`, {
            method: "DELETE",
        });
    
        const result = await response.json();
    
        if (response.ok && result.success) {
            // Hapus data yang dihapus dari tabel
            setData(data.filter((item) => item.id_user !== deleteId));
            setShowConfirmModal(false);  // Tutup modal konfirmasi
            setSuccess(result.message);
            setError("");  // Kosongkan error
        } else {
            setError(result.message || "Failed to delete employee.");
        }
        } catch (err) {
        console.error("Error deleting employee:", err);
        setError("An error occurred while deleting employee.");
        }
    };
    
    const handleDeleteCancel = () => {
        setShowConfirmModal(false);  // Tutup modal jika tidak ingin menghapus
    };

    const [showModalEdit, setShowModalEdit] = useState(false); // Modal Edit state
    // Menangani klik Edit
    const handleEdit = (row) => {
        setFormData({
        id_user: row.id_user,
        nama_user: row.nama_user,
        gender: row.gender || "",
        alamat: row.alamat || "",
        role: row.role,
        });
        setShowModalEdit(true);
    };

    // Function to handle closing the modal and clearing the form
    const handleCloseModalEdit = () => {
      setFormData({
          nama_user: "",
          role: 1, 
          gender: 1,
          alamat: "",
      }); // Reset form fields to initial state
      setShowModalEdit(false); // Close the modal
    };

    // Filtered data based on the search query
    const filteredData = data.filter(row => {
      const roleText = row.role === 1 ? "user" : "hrd"; // Konversi role ke teks
      const genderText = row.gender === 1 ? "male" : "female"; // Konversi gender ke teks
      return (
        row.nama_user.toLowerCase().includes(search.toLowerCase()) ||
        row.alamat.toLowerCase().includes(search.toLowerCase()) ||
        roleText.toLowerCase().includes(search.toLowerCase()) ||
        genderText.toLowerCase().includes(search.toLowerCase())
      );
    });

    // Fungsi untuk menangani submit form edit
    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        // Ambil username dari localStorage
        const username = localStorage.getItem("username");
    
        if (!username) {
        setError("Username is required.");
        return;
        }
    
        // Tambahkan username ke formData untuk update
        const formDataWithUsername = {
        ...formData,
        username: username,
        };
    
        try {
        const response = await fetch("http://127.0.0.1:8000/api/updateKaryawan", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(formDataWithUsername),
        });
    
        const result = await response.json();
    
        if (response.ok && result.success) {
            // Update data karyawan pada tabel
            setData(
            data.map((item) =>
                item.id_user === result.data.id_user ? result.data : item
            )
            );
            setError("");
            setShowModalEdit(false); // Tutup modal setelah berhasil edit
            setSuccess(result.message);
        } else {
            setError(result.message || "Failed to update employee.");
        }
        } catch (err) {
        console.error("Error updating employee:", err);
        setError("An error occurred while updating employee.");
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

    // Menghilangkan success setelah 3 detik
    useEffect(() => {
      if (success) {
        const timer = setTimeout(() => {
          setSuccess("");
        }, 3000);
        return () => clearTimeout(timer); // Membersihkan timer
      }
    }, [success]);

    const dashboard2 = () => {
      navigate("/dashboard2"); // ke halaman dashboard2
    };
  
    const dashboard1 = () => {
      navigate("/dashboard1"); // ke halaman dashboard2
    };

    // Handle search input change
    const handleSearchChange = (e) => {
      setSearch(e.target.value);
    };
  

  return (
    <>
    <div style={{ display: "flex", height: "100vh"   }}>
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
        <div className="bg-white shadow-lg rounded-lg p-4 w-100" style={{ maxWidth: "1200px" }}>
          <h2 className="text-center mb-4">Employee Data</h2>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

            {/* Search Bar */}
            <div
              className="d-flex justify-content-between align-items-center mb-3"
              style={{
                gap: "16px",
              }}
            >
            
            <Button
              variant="primary"
              onClick={handleShowModal}
              className="btn-block"
            >
              Add Employee <FontAwesomeIcon icon={faPlusSquare} />
            </Button>

            
            <div
              className="d-flex align-items-center"
              style={{
                gap: "8px", 
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
          </div>


          {loading ? (
            <p className="text-center">Loading data...</p>
          ) : (
            <DataTable
              columns={columns}
              data={filteredData}
              pagination
              highlightOnHover
              striped
            />
          )}

          {/* Modal untuk Form */}
          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>Add Employee</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="nama_user" className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="nama_user"
                    value={formData.nama_user}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="gender" className="mb-3">
                  <Form.Label>Gender</Form.Label>
                  <Form.Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="1">Male</option>
                    <option value="2">Female</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group controlId="alamat" className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="role" className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="1">User</option>
                    <option value="2">HRD</option>
                  </Form.Select>
                </Form.Group>
                <Button variant="primary" type="submit" block>
                  Save <FontAwesomeIcon icon={faSave} />
                </Button>
              </Form>
            </Modal.Body>
          </Modal>
        </div>
    </div>
    </div>
    </div>

    {/* Modal Konfirmasi Hapus */}
    {showConfirmModal && (
        <div className="modal show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog">
            <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
            </div>
            <div className="modal-body">
                <p>Are you sure you want to delete this employee?</p>
            </div>
            <div className="modal-footer">
                <Button variant="secondary" onClick={handleDeleteCancel}>
                Cancel
                </Button>
                <Button variant="danger" onClick={handleDeleteConfirm}>
                Delete
                </Button>
            </div>
            </div>
        </div>
        </div>
    )}

    {/* Modal untuk Edit Karyawan */}
    <Modal show={showModalEdit} onHide={handleCloseModalEdit}>
    <Modal.Header closeButton>
        <Modal.Title>Edit Employee</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        <Form onSubmit={handleSubmitEdit}>
        <Form.Group controlId="nama_user" className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
            type="text"
            name="nama_user"
            value={formData.nama_user}
            onChange={handleChange}
            required
            />
        </Form.Group>
        <Form.Group controlId="gender" className="mb-3">
            <Form.Label>Gender</Form.Label>
            <Form.Select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            >
            <option value="1">Male</option>
            <option value="2">Female</option>
            </Form.Select>
        </Form.Group>
        <Form.Group controlId="alamat" className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control
            type="text"
            name="alamat"
            value={formData.alamat}
            onChange={handleChange}
            required
            />
        </Form.Group>
        <Form.Group controlId="role" className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            >
            <option value="1">User</option>
            <option value="2">HRD</option>
            </Form.Select>
        </Form.Group>
        <Button variant="primary" type="submit" block>
            Save <FontAwesomeIcon icon={faSave} />
        </Button>
        </Form>
    </Modal.Body>
    </Modal>

    </>
  );
};

export default Dashboard2;