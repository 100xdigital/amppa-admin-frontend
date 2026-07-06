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
import  Select  from 'react-select';


function Product() {
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
const [image, setImage] = useState(null);
 const [show, setShow] = useState(false);
 const [product_images, setProductImages] = useState([]);

 const [imagePreviews, setImagePreviews] = useState([]);
   const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
  
    name:"",
    category:"",
   price:"",
   stock:"",
   title:"",
   product_image:"",
     short_description:"",
       long_description:"",

  });
  
  const [productData, setProductData] = useState([]);
  const [editProductId, setEditProductId] = useState(null);

  const fileInputRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [query, setQuery] = useState("");
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = productData.slice(indexOfFirstItem, indexOfLastItem);
const tagOptions = [
  { value: 'Brightening', label: 'Brightening' },
  { value: 'Hydration', label: 'Hydration' },
  { value: 'Acne', label: 'Acne' },
  { value: 'Anti-Ageing', label: 'Anti-Ageing' },
  { value: 'Redness', label: 'Redness' },
  { value: 'Sensitive Skin', label: 'Sensitive Skin' },
  { value: 'Sun Protection', label: 'Sun Protection' },
];
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
const handleClose = () => {
  setShow(false);
  setEditProductId(null);
  setNewProduct({
    name: "",
    category: "",
    price: "",
    stock: "",
    title: "",
    product_images: [],
    short_description: "",
    long_description: "",
  });
  setProductImages([]);
  setImagePreviews([]); // if you changed to imagePreviews state as I suggested earlier
};




  const handleShow = () => setShow(true);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

const handleImageUpload = (e) => {
  const files = Array.from(e.target.files);
  setProductImages(files);

  // Create preview URLs for all files
  const previews = files.map(file => URL.createObjectURL(file));
  setImagePreviews(previews);
};

 


  
  const handleAddproduct = async () => {
  const {
    name,
    category,
    price,
    stock,
    title,
    short_description,
    long_description,
  } = newProduct;

  const formData = new FormData();

  formData.append('name', name);
  formData.append('category', category);
  formData.append('price', price);
  formData.append('stock', stock);
  formData.append('title', title);
  formData.append('tags', JSON.stringify(newProduct.tags || []));
  formData.append('short_description', short_description);
  formData.append('long_description', long_description);

  // Append all product images
  product_images.forEach((file) => {
    formData.append('product_images', file);
  });

  if (editProductId !== null) {
    // Update product
    api.put(`/products/${editProductId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then((response) => {
        fetchData();
        handleClose();
      })
      .catch((error) => console.error('Error:', error));
  } else {
    // Create product
    api.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then((response) => {
        setProductData((prevData) => [response.data, ...prevData]);
        handleClose();
      })
      .catch((error) => console.error('Error:', error));
  }
};

  useEffect(() => {
    console.log("product data:", productData);
    fetchData();
  }, []);
  const fetchData = async() => {
api.get(`/products`)
        .then(response => {
          console.log("response===========>",response.data);
         const productListWithIds = response.data
        .slice()        // copy array
        .reverse()      // newest first
        .map((product, index) => ({
          ...product,
          sno: index + 1,
        }));
      setProductData(productListWithIds);
      setCurrentPage(1); // optional: reset to first page
    })
        .catch(err => {
          console.error("Error fetching data:", err);
        });
    };
 const handleEditproduct = async (id) => {
  api.get(`/products/${id}`)
    .then(response => {
      const productToEdit = response.data;
      setEditProductId(id);
      setNewProduct({
        id: productToEdit._id,
        name: productToEdit.name,
        category: productToEdit.category,
        price: productToEdit.price,
        stock: productToEdit.stock,
        title: productToEdit.title,
        product_images: productToEdit.product_images || [],
        short_description: productToEdit.short_description,
        long_description: productToEdit.long_description
      });

      // Set preview images from existing product_images URLs
      const existingImagePreviews = (productToEdit.product_images || []).map(img => imagePath + img);
      setImagePreviews(existingImagePreviews);

      handleShow();
    })
    .catch(error => {
      console.error('Error fetching product data:', error);
    });
};


  
  const handleDeleteproduct =  async(id) => {
    api.delete(`/products/${id}`)
      .then(response => {
        console.log("product deleted successfully" + response.data);
        const updatedproductData = productData.filter((product) => product._id !== id);
        setProductData(updatedproductData.map((product, index) => ({
          ...product,
          sno: index + 1 // Update sno based on current index
        })));
      })
      .catch(error => {
        console.error('Error deleting product:', error);
      });
  };
  const handleRemoveImage = (index) => {
  const updatedPreviews = [...imagePreviews];
  const updatedFiles = [...product_images];

  updatedPreviews.splice(index, 1);
  updatedFiles.splice(index, 1);

  setImagePreviews(updatedPreviews);
  setProductImages(updatedFiles);
};

const imagePath=import.meta.env.VITE_API_URL || "http://localhost:5000";
  return (
    <>
      <div className="wrapper d-flex align-items-stretch">
       <Sidebar/>
        <div id="content" className="p-4 p-md-5">
      <Header/>
          <h2 className="mb-4">products</h2>
          <Row>
            <Col md={{ span: 5, offset: 5 }}>
              <div className="form-group has-search">
                <span className="fa fa-search form-control-feedback" />
                <input type="text" className="form-control" placeholder="Search" onChange={(e) => setQuery(e.target.value)} />
              </div>
            </Col>
            <Col md={{ span: 0, offset: 0 }}>
              <Button variant="primary" onClick={handleShow}>
                <BsGrid1X2Fill className="icon" /> Add product
              </Button>
            </Col>
          </Row>
          <Modal show={show} onHide={handleClose} id='addproduct'>
            <div className="modal-contents">
              <Modal.Header id="addprod">
                <Modal.Title style={{ color: '#fff' }}>{editProductId ? 'Edit product' : 'Add product'}</Modal.Title>
                <Button style={{ visibility: 'hidden' }} variant="secondary" onClick={handleClose}>
                  X
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                  X
                </Button>
              </Modal.Header>
              
              <div className="row" style={{display:'block',margin:'auto'}}>
            <div className="col-xs-12 col-sm-12">
  <div className="box">
    {/* Circle container with upload button */}
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
        multiple
      />
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
    </div>

    {/* Image previews outside the circle container */}
 <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '15px' }}>
 {imagePreviews.length > 0 ? (
  imagePreviews.map((src, index) => (
    <div key={index} style={{ position: 'relative' }}>
      <img
        src={src}
        alt={`Preview ${index + 1}`}
        style={{
          width: 80,
          height: 80,
          objectFit: 'cover',
          borderRadius: '8px',
          border: '1px solid #ccc',
        }}
      />
      <button
        onClick={() => handleRemoveImage(index)}
        style={{
          position: 'absolute',
          top: -5,
          right: -5,
          backgroundColor: '#ff0000',
          border: 'none',
          color: '#fff',
          borderRadius: '50%',
          width: 20,
          height: 20,
          cursor: 'pointer',
          fontSize: '12px',
          lineHeight: '18px',
          padding: 0
        }}
      >
        ×
      </button>
    </div>
  ))
) : (
  <span>No images selected</span>
)}

</div>

  </div>
</div>

                <div className="col-xs-12 col-sm-12">
                  <div className="box">
                    <Form style={{ color: '#fff' }}>
                      <Form.Group className="mb-3" >
                        <Form.Label>Product Name </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder={newProduct.name}
                          name="productname"
                          value={newProduct.name}
                          id="productname"
                          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                          className="form"
                        
                        />
                      </Form.Group>
                      <Form.Group className="mb-3" >
                        <Form.Label>Category </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder={newProduct.category}
                          name="category"
                          value={newProduct.category}
                          id="category"
                          onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                          className="form"
                        
                        />
                      </Form.Group>
                    
                      <Form.Group className="mb-3" >
                        <Form.Label>Price </Form.Label>
                        <Form.Control
                          type="number"
                          placeholder=""
                          name="price"
                          id="price"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                          className="form"
                        />
                      </Form.Group>
                      <Form.Group className="mb-3" >
                        <Form.Label>Stock </Form.Label>
                        <Form.Control
                          type="number"
                          placeholder=""
                          name="stock"
                          id="stock"
                          value={newProduct.stock}
                          onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                          className="form"
                        />
                      </Form.Group>
                       <Form.Group className="mb-3" >
                        <Form.Label>Title </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder={newProduct.title}
                          name="title"
                          value={newProduct.title}
                          id="title"
                          onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                          className="form"
                        
                        />
                      </Form.Group>
                        <Form.Group className="mb-3" >
                        <Form.Label>Short description</Form.Label>
                        <Form.Control as="textarea" aria-label="With textarea"
                       
                       value={newProduct.short_description}
                       onChange={(e) => setNewProduct({ ...newProduct, short_description: e.target.value })}
                         />
                      </Form.Group>
                    
<Form.Group className="mb-3">
  <Form.Label>Availability (Tags)</Form.Label>
  <Select
    isMulti
    options={tagOptions}
    value={tagOptions.filter(option => (newProduct.tags || []).includes(option.value))}
    onChange={(selectedOptions) => 
      setNewProduct({ ...newProduct, tags: selectedOptions.map(option => option.value) })
    }
    styles={{
      control: (provided) => ({
        ...provided,
        backgroundColor: 'black',       // input background
        color: 'white',
      }),
      menu: (provided) => ({
        ...provided,
        backgroundColor: 'black',       // dropdown background
        color: 'white',
      }),
      option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isFocused ? '#333' : 'black', // hover effect
        color: 'white',
      }),
      multiValue: (provided) => ({
        ...provided,
        backgroundColor: '#444',         // selected tag background
        color: 'white',
      }),
      multiValueLabel: (provided) => ({
        ...provided,
        color: 'white',
      }),
      multiValueRemove: (provided) => ({
        ...provided,
        color: 'white',
        ':hover': {
          backgroundColor: '#666',
          color: 'white',
        },
      }),
    }}
  />
</Form.Group>

                   <Form.Group className="mb-3">
  <Form.Label>Long description</Form.Label>
<ReactQuill
 
    value={newProduct.long_description || ""}
    onChange={(value) =>
      setNewProduct({ ...newProduct, long_description: value })
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
             
                <Button variant="primary" onClick={handleAddproduct}>
                  {editProductId ? 'Save' : 'Add'}
                </Button>
              </Modal.Footer>
            </div>
          </Modal>
          <Table responsive style={{color:'#fff',marginTop:'1rem'}}  >
            <thead style={{background:'#393938'}}>
              <tr>
                <th>Sno</th>
                <th>Image</th>
                <th>Product name</th>
                <th>Category</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              
              {currentItems
              .filter(item => {
                const lowercaseQuery = query.toLowerCase();
                return(
                  item?.name && item.name.toLowerCase().startsWith(lowercaseQuery)||
                  item?.category && item.category.toLowerCase().startsWith(lowercaseQuery)
                ) 

              })
              .map((product,index) => (
                <tr key={index+1}>
                  <td>{index+1}</td>
            
<td>
{product.product_images && product.product_images.length > 0 ? (
  <img
    src={imagePath + product.product_images[0]}
    alt={product.name}
    style={{ width: '50px', height: '50px' }}
  />
) : (
  <span>No image</span>
)}

    
</td>

                  {/* <td>
                    <img src={product.product_image} alt={product.product_name} style={{ width: '50px', height: '50px' }} />
                  </td> */}
          <td><p className="productpara">{product.name}</p></td>
<td><p className="productpara">{product.category}</p></td>
               
                  <td>
                  {/* <FaRegEdit  onClick={() => handleEditproduct(product._id)}/> */}
                    <Button variant="primary" onClick={() => handleEditproduct(product._id)}>Edit</Button>
                    <Button variant="danger" className="butdang" id="dan"  onClick={() => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      handleDeleteproduct(product._id);
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
          
            {[...Array(Math.ceil(productData.length / itemsPerPage)).keys()].map((number) => (
              <Pagination.Item key={number + 1} onClick={() => paginate(number + 1)}>
                {number + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => paginate(currentPage + 1)} />
            <Pagination.Last onClick={() => paginate(Math.ceil(productData.length / itemsPerPage))} />
          </Pagination>
        </div>
      </div>
    </>
  );
}

export default Product
