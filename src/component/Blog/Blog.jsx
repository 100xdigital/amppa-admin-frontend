import React, { useState, useRef,useEffect} from 'react';
import axios from 'axios';
import { Row, Col, Button, Form, Modal, Table,Pagination} from 'react-bootstrap';
import { BsGrid1X2Fill } from 'react-icons/bs';
import Sidebar from '../../assets/Sidebar';
import Header from '../../assets/Header';
import { FaRegEdit } from "react-icons/fa";
import api from '../../services/api';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
function Blog() {
  
 const modules = {
  toolbar: {
    container: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike"],
      ["link", "image"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["clean"],
    ],
   
  },
};

  const [show, setShow] = useState(false);
  const [image, setImage] = useState(null);
   const [showModal, setShowModal] = useState(false);
  const [newBlog, setNewBlog] = useState({
   
    title:"",
    short_description:"",
   description:"",
   meta_title:"",
   meta_description:"",
   banner_image:""
  });
  
  const [blogData, setBlogData] = useState([]);
  const [editBlogId, setEditBlogId] = useState(null);

  const fileInputRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [query, setQuery] = useState("");
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = blogData.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handleClose = () => {
    setShow(false);
    setEditBlogId(null);
    setNewBlog({
        title:"",
        short_description:"",
       description:"",
       meta_title:"",
       meta_description:"",
       banner_image:""

    });
    setImage(null);
  };

  const handleShow = () => setShow(true);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    console.log(file);
    const reader = new FileReader();

    reader.onloadend = () => {
      const uploadedImage = reader.result;
      setImage(uploadedImage);
      console.log(uploadedImage);
      setNewBlog({ ...newBlog, banner_image: file });
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };
 

  
  
const handleAddblog = async () => {
  const { title, short_description, description, meta_title, meta_description, banner_image,hashtags } = newBlog;
  const formData = new FormData();
  formData.append('title', title);
formData.append(
  'short_description',
  short_description || description.replace(/<[^>]+>/g, '').substring(0, 150)
);
  formData.append('description', description);
  formData.append('meta_title', meta_title);
  formData.append('meta_description', meta_description);
  formData.append('banner_image', banner_image);
if (hashtags && hashtags.length > 0) {
  if (Array.isArray(hashtags)) {
    hashtags.forEach(tag => formData.append("hashtags[]", tag.trim()));
  } else {
    formData.append("hashtags", hashtags);
  }
}
  if (editBlogId !== null) {
    api.put(`/blogs/${editBlogId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then(response => {
      fetchData();
      console.log("Success", response.data);
      handleClose();
    })
    .catch(error => console.error('Error:', error));
  } else {
    api.post("/blogs", formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then(response => {
      console.log("Created Blog:", response.data);
      setBlogData(prevData => [response.data, ...prevData]);
      handleClose();
    })
    .catch(error => console.error('Error:', error));
  }
};

  useEffect(() => {
    console.log("blog data:", blogData);
    fetchData();
  }, []);
  const fetchData = async() => {
api.get(`/blogs`)
        .then(response => {
          console.log("response===========>",response.data);
          const blogListWithIds = response.data.map((blog, index) => ({
            ...blog,
            sno: index + 1,
          }));
        
          setBlogData(blogListWithIds);
      
        })
        .catch(err => {
          console.error("Error fetching data:", err);
        });
    };
const handleEditblog = async (id) => {
  api.get(`/blogs/${id}`)
    .then(response => {
      const blogToEdit = response.data;
      setEditBlogId(id);
      setNewBlog({
        id: blogToEdit._id,
        title: blogToEdit.title,
        short_description: blogToEdit.short_description,
        description: blogToEdit.description,
        meta_title: blogToEdit.meta_title,
        meta_description: blogToEdit.meta_description,
        banner_image: blogToEdit.banner_image,
      });
      setImage(imagePath + blogToEdit.banner_image);
      handleShow();
    })
    .catch(error => {
      console.error('Error fetching blog data:', error);
    });
};

  
  const handleDeleteblog =  async(id) => {
    api.delete(`/blogs/${id}`)
      .then(response => {
        console.log("blog deleted successfully" + response.data);
        const updatedblogData = blogData.filter((blog) => blog._id !== id);
        setBlogData(updatedblogData.map((blog, index) => ({
          ...blog,
          sno: index + 1 // Update sno based on current index
        })));
      })
      .catch(error => {
        console.error('Error deleting blog:', error);
      });
  };
 const imagePath=import.meta.env.VITE_API_URL || "http://localhost:5000";
  return (
    <>
      <div className="wrapper d-flex align-items-stretch">
       <Sidebar/>
        <div id="content" className="p-4 p-md-5">
      <Header/>
          <h2 className="mb-4">Blogs</h2>
          <Row>
            <Col md={{ span: 5, offset: 5 }}>
              <div className="form-group has-search">
                <span className="fa fa-search form-control-feedback" />
                <input type="text" className="form-control" placeholder="Search" onChange={(e) => setQuery(e.target.value)} />
              </div>
            </Col>
            <Col md={{ span: 0, offset: 0 }}>
              <Button variant="primary" onClick={handleShow}>
                <BsGrid1X2Fill className="icon" /> Add blog
              </Button>
            </Col>
          </Row>
          <Modal show={show} onHide={handleClose} id='addblog'>
            <div className="modal-contents">
<Modal.Header id="addprod">
  <Modal.Title style={{ color: '#fff' }}>
    {editBlogId ? 'Edit blog' : 'Add blog'}
  </Modal.Title>
  <Button variant="secondary" onClick={handleClose}>
    X
  </Button>
</Modal.Header>

              
              <div className="row" style={{display:'block',margin:'auto'}}>
              <div className="col-xs-12 col-sm-12">
                  <div className="box">
                    <div
                      style={{
                        width: '120px',
                        height: '120px',
                        border: '2px solid #ccc',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        margin: '7px auto',
                        position: 'relative',
                        background:'#fff',
                      }}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleImageUpload}
                      />
                      {!image && (
                      <button
                        onClick={handleButtonClick}
                        style={{
                          position: 'absolute',
                          bottom: '30px',
                          left: '50%',
                          color: '#000',
                          transform: 'translateX(-50%)',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        Upload Image
                      </button>
                      )}
                      {image ? (
                        <img src={image} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                      ) : (
                        <img src={imagePath+newBlog.banner_image} alt="default" style={{ maxWidth: '50%', maxHeight: '50%' }} />
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-xs-12 col-sm-12">
                  <div className="box">
                    <Form style={{ color: '#fff' }}>
                      <Form.Group className="mb-3" >
                        <Form.Label>Blog Title </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder={newBlog.title}
                          name="blogtitle"
                          value={newBlog.title}
                          id="blogtitle"
                          onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                          className="form"
                        
                        />
                      </Form.Group>
                         <Form.Group className="mb-3" >
                        <Form.Label>Meta Title</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder=""
                          name="meta_title"
                          id="meta_title"
                          value={newBlog.meta_title}
                          onChange={(e) => setNewBlog({ ...newBlog, meta_title: e.target.value })}
                          className="form"
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
  <Form.Label>Hashtags (comma separated)</Form.Label>
  <Form.Control
    type="text"
    placeholder="#hair, #beauty, #spa"
    value={newBlog.hashtags || ""}
    onChange={(e) =>
      setNewBlog({ ...newBlog, hashtags: e.target.value.split(",") })
    }
  />
</Form.Group>

                      <Form.Group className="mb-3" >
                        <Form.Label>Meta Description</Form.Label>
                        
                        <Form.Control as="textarea" aria-label="With textarea"
                       
                       value={newBlog.meta_description}
                       onChange={(e) => setNewBlog({ ...newBlog, meta_description: e.target.value })}
                         />
                      </Form.Group>
                      
<Form.Group className="mb-3">
  <Form.Label>Short Description</Form.Label>
  <Form.Control
    as="textarea"
    rows={2}
    placeholder="Enter a short summary (max 150 characters)"
    name="short_description"
    id="short_description"
    value={newBlog.short_description}
    onChange={(e) =>
      setNewBlog({ ...newBlog, short_description: e.target.value })
    }
    className="form"
  />
</Form.Group>

                      <Form.Group className="mb-5" >
                        <Form.Label>Description</Form.Label>
                        {/* <Form.Control as="textarea" aria-label="With textarea" id='description'
                       value={newBlog.description}
                       onChange={(e) => setNewBlog({ ...newBlog, description: e.target.value })}
                         /> */}
                          <ReactQuill
                         
                            value={newBlog.description}
                            onChange={(value) =>
                              setNewBlog({ ...newBlog, description: value  })
                            }
                            theme="snow"
                            modules={modules}
                            placeholder="Enter product details here..."
                            style={{ height: '200px', marginBottom: '20px' }}
                          />
                       
                      </Form.Group>
                   
                   
                    </Form>
                    
                  </div>
                </div>
               
              </div>
              <Modal.Footer>
             
                <Button variant="primary" onClick={handleAddblog}>
                  {editBlogId ? 'Save' : 'Add'}
                </Button>
              </Modal.Footer>
            </div>
          </Modal>
          <Table responsive style={{color:'#fff',marginTop:'1rem'}}  >
            <thead style={{background:'#393938'}}>
              <tr>
                <th>Sno</th>
                <th>Image</th>
                <th>Blog List</th>
                <th>Title</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              
              {currentItems
           .filter(item => {
  const lowercaseQuery = query.toLowerCase();
  return (
    (item?.title && item.title.toLowerCase().startsWith(lowercaseQuery)) ||
    (item?.meta_description && item.meta_description.toLowerCase().startsWith(lowercaseQuery))
  );
})

              .map((blog,index) => (
                <tr key={index+1}>
                  <td>{index+1}</td>
            
<td>
<img
        src={imagePath +  blog?.banner_image}
        alt={blog?.title}
        style={{ width: '50px', height: '50px' }}
      />
    
</td>

                  {/* <td>
                    <img src={blog.blog_image} alt={blog.blog_name} style={{ width: '50px', height: '50px' }} />
                  </td> */}
                  <td ><p className="blogpara">{blog.meta_description}</p></td>
                  <td><p className="blogpara">{blog.title}</p></td>
               
                  <td>
                  {/* <FaRegEdit  onClick={() => handleEditblog(blog._id)}/> */}
                    <Button variant="primary" onClick={() => handleEditblog(blog._id)}>Edit</Button>
                    <Button variant="danger" className="butdang" id="dan"  onClick={() => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      handleDeleteblog(blog._id);
    }
  }}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
  
          <Pagination>
            <Pagination.First onClick={() => paginate(1)} />
            <Pagination.Prev onClick={() => paginate(currentPage - 1)} />
          
            {[...Array(Math.ceil(blogData.length / itemsPerPage)).keys()].map((number) => (
              <Pagination.Item key={number + 1} onClick={() => paginate(number + 1)}>
                {number + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => paginate(currentPage + 1)} />
            <Pagination.Last onClick={() => paginate(Math.ceil(blogData.length / itemsPerPage))} />
          </Pagination>
        </div>
      </div>
    </>
  );
}

export default Blog;
