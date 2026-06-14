import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Modal, Table, Pagination } from 'react-bootstrap';
import { BsGrid1X2Fill } from 'react-icons/bs';
import Header from '../../assets/Header';
import Sidebar from '../../assets/Sidebar';
import Form from 'react-bootstrap/Form';
import { Icon } from 'react-icons-kit';
import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { eye } from 'react-icons-kit/feather/eye';
import api from '../../services/api';

function Admin() {
  const [show, setShow] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [newAdmin, setNewAdmin] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    pwd: '',
    cnfpwd: '',
    role: '',
    added: '',
  });
  const [type, setType] = useState('password');
  const [icon, setIcon] = useState(eyeOff);
  const [adminData, setAdminData] = useState([]);
  const [editAdminId, setEditAdminId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [query, setQuery] = useState("");

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = adminData.slice(indexOfFirstItem, indexOfLastItem);

  // toggle password eye
  const handleToggle = () => {
    if (type === 'password') {
      setIcon(eye);
      setType('text');
    } else {
      setIcon(eyeOff);
      setType('password');
    }
  };

  // open modal (Add / Edit)
  const handleShow = () => {
    if (!editAdminId) {
      // reset form if adding new admin
      setNewAdmin({
        id: '',
        name: '',
        email: '',
        phone: '',
        pwd: '',
        cnfpwd: '',
        role: '',
        added: '',
      });
    }
    setShow(true);
  };

  // close modal
  const handleClose = () => {
    setShow(false);
    setEditAdminId(null);
    setNewAdmin({
      id: '',
      name: '',
      email: '',
      phone: '',
      pwd: '',
      cnfpwd: '',
      role: '',
      added: '',
    });
  };

  // add or update admin
  const handleAddAdmin = async () => {
    const { name, phone, email, role, pwd, cnfpwd } = newAdmin;

    // ✅ Create mode → password required
    if (!editAdminId) {
      if (!pwd) {
        alert("Password is required for new admin!");
        return;
      }
      if (pwd !== cnfpwd) {
        setPasswordsMatch(false);
        return;
      }
    }

    // ✅ Edit mode → password optional
    if (editAdminId) {
      if (pwd && pwd !== cnfpwd) {
        setPasswordsMatch(false);
        return;
      }
    }

    setPasswordsMatch(true);

    if (editAdminId !== null) {
      // update
      api.put(`/users/${editAdminId}`, {
        name,
        email,
        phone,
        role,
        ...(pwd ? { password: pwd } : {}), // only send password if entered
      })
        .then(() => {
          fetchData();
          handleClose();
        })
        .catch(error => {
          console.error('Error updating user:', error);
        });
    } else {
      // create
      api.post("/users", {
        name,
        email,
        phone,
        password: pwd,
        role,
      })
        .then(response => {
          setAdminData(prevData => [response.data, ...prevData]);
          handleClose();
        })
        .catch(error => {
          console.error('Error creating user:', error);
        });
    }
  };

  // fetch admin list
  const fetchData = async () => {
    api.get(`/users`)
      .then(response => {
        const adminListWithIds = response.data.map((admin, index) => ({
          ...admin,
          sno: index + 1,
        }));
        setAdminData(adminListWithIds);
      })
      .catch(err => {
        console.error("Error fetching data:", err);
      });
  };

  // edit admin
  const handleEditAdmin = async (id) => {
    api.get(`/users/${id}`)
      .then(response => {
        const adminToEdit = response.data;
        setEditAdminId(id);
        setNewAdmin({
          id: adminToEdit._id,
          name: adminToEdit.name || '',
          email: adminToEdit.email || '',
          phone: adminToEdit.phone || '',
          pwd: '',
          cnfpwd: '',
          role: adminToEdit.role || '',
        });
        setShow(true);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  };

  // delete admin
  const handleDeleteAdmin = async (id) => {
    api.delete(`/users/${id}`)
      .then(() => {
        const updateduserData = adminData.filter((user) => user._id !== id);
        setAdminData(updateduserData.map((user, index) => ({
          ...user,
          sno: index + 1
        })));
      })
      .catch(error => {
        console.error('Error deleting user:', error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <div className="wrapper d-flex align-items-stretch">
        <Sidebar />
        <div id="content" className="p-4 p-md-5">
          <Header />
          <h2 className="mb-4">Admin</h2>
          <Row>
            <Col md={{ span: 5, offset: 5 }}>
              <div className="form-group has-search">
                <span className="fa fa-search form-control-feedback" />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search"
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </Col>
            <Col md={{ span: 0, offset: 0 }}>
              <Button
                variant="primary"
                onClick={() => {
                  setEditAdminId(null);
                  setNewAdmin({
                    id: '',
                    name: '',
                    email: '',
                    phone: '',
                    pwd: '',
                    cnfpwd: '',
                    role: '',
                    added: '',
                  });
                  handleShow();
                }}
              >
                <BsGrid1X2Fill className="icon" /> Add Admin
              </Button>
            </Col>
          </Row>

          {/* Modal */}
          <Modal show={show} onHide={handleClose}>
            <div className="modal-contents" style={{ padding: '32px' }}>
              <Modal.Header id="addprod">
                <Modal.Title style={{ color: '#fff' }}>
                  {editAdminId ? 'Edit Admin' : 'Create Admin'}
                </Modal.Title>
                <Button variant="secondary" onClick={handleClose}>
                  X
                </Button>
              </Modal.Header>
              <Form style={{ color: '#fff' }}>
                <Form.Group className="mb-3">
                  <Form.Control
                    style={{ color: '#000', background: '#fff' }}
                    type="text"
                    placeholder="Name"
                    value={newAdmin.name}
                    onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control
                    style={{ color: '#000', background: '#fff' }}
                    type="email"
                    placeholder="Email"
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control
                    style={{ color: '#000', background: '#fff' }}
                    type="number"
                    placeholder="Phone"
                    value={newAdmin.phone}
                    onChange={(e) => setNewAdmin({ ...newAdmin, phone: e.target.value })}
                  />
                </Form.Group>

                {/* Password Field */}
                <Form.Group className="mb-3" style={{ position: 'relative' }}>
                  <Form.Control
                    style={{ color: '#000', background: '#fff', paddingRight: '40px' }}
                    type={type}
                    placeholder="Password"
                    value={newAdmin.pwd}
                    onChange={(e) => setNewAdmin({ ...newAdmin, pwd: e.target.value })}
                  />
                  <span
                    onClick={handleToggle}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      right: '10px',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer'
                    }}
                  >
                    <Icon icon={icon} size={20} style={{ color: '#000' }} />
                  </span>
                </Form.Group>

                {/* Confirm Password → only show when needed */}
                {((!editAdminId) || (newAdmin.pwd)) && (
                  <Form.Group className="mb-3">
                    <Form.Control
                      style={{ color: '#000', background: '#fff' }}
                      type="password"
                      placeholder="Confirm Password"
                      value={newAdmin.cnfpwd}
                      onChange={(e) => setNewAdmin({ ...newAdmin, cnfpwd: e.target.value })}
                    />
                    {!passwordsMatch && (
                      <div style={{ color: 'red', fontSize: '0.9rem' }}>
                        Passwords do not match
                      </div>
                    )}
                  </Form.Group>
                )}

                <Form.Group className="mb-3">
                  <Form.Select
                    style={{ color: '#000', background: '#fff' }}
                    value={newAdmin.role}
                    onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                  >
                    <option value="">Select Role</option>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                  </Form.Select>
                </Form.Group>
              </Form>
              <Modal.Footer>
                <Button variant="primary" onClick={handleAddAdmin}>
                  {editAdminId ? 'Save' : 'Create Admin'}
                </Button>
              </Modal.Footer>
            </div>
          </Modal>

          {/* Table */}
          <Table responsive style={{ color: '#fff', marginTop: '1rem' }}>
            <thead style={{ background: '#393938' }}>
              <tr>
                <th>S No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone No</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems
                .filter(item => {
                  const lowercaseQuery = query.toLowerCase();
                  return (
                    item.name.toLowerCase().startsWith(lowercaseQuery) ||
                    item.email.toLowerCase().includes(lowercaseQuery) ||
                    item.phone.toString().includes(query)
                  );
                })
                .map((user, index) => (
                  <tr key={index + 1}>
                    <td>{indexOfFirstItem + index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td style={{ padding: '8px 0' }}>
                      <div
                        className="btngrp"
                        style={{
                          background: '#393938',
                          border: '0.5px solid #979797',
                          width: '60%',
                          textAlign: 'center',
                          borderRadius: '12px'
                        }}
                      >
                        <Button
                          onClick={() => handleEditAdmin(user._id)}
                          style={{
                            background: '#393938',
                            border: 'none',
                            borderRight: '0.5px solid #fff'
                          }}
                        >
                          <img src='/images/pencil-write.png' alt="" />
                        </Button>
                        <Button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this user?')) {
                              handleDeleteAdmin(user._id);
                            }
                          }}
                          style={{ background: '#393938', marginLeft: '0', border: 'none' }}
                        >
                          <img src='/images/bin.png' alt="" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>

          {/* Pagination */}
          <Pagination>
            <Pagination.First onClick={() => paginate(1)} />
            <Pagination.Prev onClick={() => paginate(currentPage - 1)} />
            {[...Array(Math.ceil(adminData.length / itemsPerPage)).keys()].map((number) => (
              <Pagination.Item
                key={number + 1}
                onClick={() => paginate(number + 1)}
              >
                {number + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => paginate(currentPage + 1)} />
            <Pagination.Last onClick={() => paginate(Math.ceil(adminData.length / itemsPerPage))} />
          </Pagination>
        </div>
      </div>
    </>
  );
}

export default Admin;
