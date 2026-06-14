import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Button, Form, Modal, Table, Pagination } from "react-bootstrap";
import Sidebar from "../../assets/Sidebar";
import Header from "../../assets/Header";
import { BsGrid1X2Fill } from "react-icons/bs";
import { FaRegEdit } from "react-icons/fa";
import api from "../../services/api"; // ✅ axios instancei
import "../../App.css";


function Offer() {
  const [show, setShow] = useState(false);
  const [offers, setOffers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [newOffer, setNewOffer] = useState({ title: "", offer_name: "" });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const API_BASE = "http://localhost:5000"; // ⚙️ Change to server URL if hosted

  // 🔹 Fetch all offers
  const fetchOffers = async () => {
    try {
      const res = await api.get("/offers");
      setOffers(res.data.reverse());
    } catch (err) {
      console.error("Error fetching offers:", err);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  // 🔹 Open/Close modal
  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    setEditId(null);
    setNewOffer({ title: "", offer_name: "" });
    setImage(null);
    setImagePreview(null);
  };

  // 🔹 File input trigger
  const handleButtonClick = () => fileInputRef.current.click();

  // 🔹 Image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // 🔹 Add / Edit offer
  const handleSave = async () => {
    const formData = new FormData();
    formData.append("title", newOffer.title);
    formData.append("offer_name", newOffer.offer_name);
    if (image) formData.append("offer_image", image);

    try {
      if (editId) {
        await api.put(`/offers/${editId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/offers", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      fetchOffers();
      handleClose();
    } catch (err) {
      console.error("Error saving offer:", err);
    }
  };

  // 🔹 Edit Offer
  const handleEdit = async (id) => {
    try {
      const res = await api.get(`/offers/${id}`);
      const offer = res.data;
      setEditId(id);
      setNewOffer({ title: offer.title, offer_name: offer.offer_name });
      if (offer.offer_image) setImagePreview(API_BASE + offer.offer_image);
      handleShow();
    } catch (err) {
      console.error("Error fetching offer:", err);
    }
  };

  // 🔹 Delete Offer
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this offer?")) {
      try {
        await api.delete(`/offers/${id}`);
        fetchOffers();
      } catch (err) {
        console.error("Error deleting offer:", err);
      }
    }
  };

  // 🔹 Pagination
  const filtered = offers.filter((o) =>
    o.title.toLowerCase().includes(query.toLowerCase())
  );
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirst, indexOfLast);

  return (
    <div className="wrapper d-flex align-items-stretch">
      <Sidebar />
      <div id="content" className="p-4 p-md-5">
        <Header />
        <h2 className="mb-4">Offers</h2>

        <Row className="align-items-center mb-3">
          <Col md={4}>
            <input
              type="text"
              className="form-control"
              placeholder="Search by title"
              onChange={(e) => setQuery(e.target.value)}
            />
          </Col>
          <Col md={{ span: 2, offset: 6 }} className="text-end">
            <Button variant="primary" onClick={handleShow}>
              <BsGrid1X2Fill className="icon" /> Add Offer
            </Button>
          </Col>
        </Row>

        {/* Modal */}
 <Modal
  show={show}
  onHide={handleClose}
  centered
  backdrop="static"
  contentClassName="custom-dark-modal"
>
  <Modal.Header closeButton closeVariant="white">
    <Modal.Title style={{ color: "#fff" }}>
      {editId ? "Edit Offer" : "Add Offer"}
    </Modal.Title>
  </Modal.Header>

  <Modal.Body>
    <Form>
      <div className="text-center mb-3">
        {imagePreview ? (
          <img
            src={imagePreview}
            alt="Preview"
            style={{
              width: 100,
              height: 100,
              borderRadius: "10px",
              objectFit: "cover",
              boxShadow: "0 2px 8px rgba(255,255,255,0.2)",
            }}
          />
        ) : (
          <div
            style={{
              width: 100,
              height: 100,
              border: "2px dashed #666",
              margin: "auto",
              borderRadius: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#aaa",
              backgroundColor: "rgba(255,255,255,0.05)",
            }}
          >
            No Image
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          style={{ display: "none" }}
        />
        <Button
          variant="light"
          size="sm"
          onClick={handleButtonClick}
          className="mt-2"
        >
          Upload Image
        </Button>
      </div>

      <Form.Group className="mb-3">
        <Form.Label style={{ color: "#ccc" }}>Title</Form.Label>
        <Form.Control
          type="text"
          value={newOffer.title}
          onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })}
          style={{
            backgroundColor: "#222",
            color: "#fff",
            border: "1px solid #555",
          }}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label style={{ color: "#ccc" }}>Offer Name</Form.Label>
        <Form.Control
          type="text"
          value={newOffer.offer_name}
          onChange={(e) =>
            setNewOffer({ ...newOffer, offer_name: e.target.value })
          }
          style={{
            backgroundColor: "#222",
            color: "#fff",
            border: "1px solid #555",
          }}
        />
      </Form.Group>
    </Form>
  </Modal.Body>

  <Modal.Footer>
    <Button variant="light" onClick={handleClose}>
      Cancel
    </Button>
    <Button variant="primary" onClick={handleSave}>
      {editId ? "Save Changes" : "Add Offer"}
    </Button>
  </Modal.Footer>
</Modal>

        {/* Offer Table */}
        <Table responsive striped bordered style={{ marginTop: "1rem" }}>
          <thead style={{ background: "#2e2e2e", color: "#fff" }}>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Title</th>
              <th>Offer Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody style={{ background: "#2e2e2e", color: "#fff" }}>
            {currentItems.map((offer, i) => (
              <tr key={offer._id}>
                <td>{i + 1}</td>
                <td>
                  {offer.offer_image ? (
                    <img
                      src={API_BASE + offer.offer_image}
                      alt={offer.title}
                      style={{ width: 50, height: 50, borderRadius: "5px" }}
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td>{offer.title}</td>
                <td>{offer.offer_name}</td>
                <td>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleEdit(offer._id)}
                    className="me-2"
                  >
                    <FaRegEdit />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(offer._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Pagination className="mt-3">
          {[...Array(Math.ceil(filtered.length / itemsPerPage)).keys()].map((num) => (
            <Pagination.Item
              key={num + 1}
              onClick={() => setCurrentPage(num + 1)}
              active={currentPage === num + 1}
            >
              {num + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </div>
    </div>
  );
}

export default Offer;
