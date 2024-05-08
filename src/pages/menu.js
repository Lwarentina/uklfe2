import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Modal, Table } from "react-bootstrap";

const Menu = () => {
  const [menuList, setMenuList] = useState([]);
  const [newMenu, setNewMenu] = useState({
    name: "",
    spicy_level: "",
    price: 0,
    image: null,
  });
  const [showModal, setShowModal] = useState(false);
  const [editMenu, setEditMenu] = useState(null); // State to track the edited menu item
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchData();
  }, [searchQuery]); // Fetch data whenever searchQuery changes

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://172.16.100.39:8080/food?search=${searchQuery}`);
      setMenuList(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleInputChange = (e) => {
    setNewMenu({ ...newMenu, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setNewMenu({ ...newMenu, image: e.target.files[0] });
  };

  const handleAdd = () => {
    setEditMenu(null); // Reset editMenu state
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewMenu({ // Reset newMenu state when closing modal
      name: "",
      spicy_level: "",
      price: 0,
      image: null,
    });
  };

  const handleEdit = (index) => {
    setEditMenu(menuList[index]); // Set the menu item to be edited
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (editMenu) {
      await updateMenu(editMenu.id);
    } else {
      await addMenu();
    }

    handleCloseModal();
  };

  const addMenu = async () => {
    const formData = new FormData();
    formData.append("name", newMenu.name);
    formData.append("spicy_level", newMenu.spicy_level);
    formData.append("price", newMenu.price);
    formData.append("image", newMenu.image);

    try {
      const response = await axios.post(
        "http://172.16.100.39:8080/food",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response.data);
      setNewMenu({
        name: "",
        spicy_level: "",
        price: 0,
        image: null,
      });
      fetchData(); // Fetch data after adding new menu
    } catch (error) {
      console.error("Error adding menu:", error);
    }
  };

  const updateMenu = async (id) => {
    const formData = new FormData();
    formData.append("name", newMenu.name);
    formData.append("spicy_level", newMenu.spicy_level);
    formData.append("price", newMenu.price);
    formData.append("image", newMenu.image);

    try {
      const response = await axios.put(
        `http://172.16.100.39:8080/food/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response.data);
      fetchData(); // Fetch data after updating menu
    } catch (error) {
      console.error("Error updating menu:", error);
    }
  };

  const handleDrop = async (id) => {
    try {
      const response = await axios.delete(
        `http://172.16.100.39:8080/food/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response.data);
      fetchData(); // Fetch data after deleting menu
    } catch (error) {
      console.error("Error deleting menu:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchData(); // Trigger data fetching when form is submitted
  };

  return (
    <div className="container">
      <h4>Hot Chicken Menu</h4>
      <Form onSubmit={handleSearch}>
        <Form.Group controlId="search">
          <Form.Control
            type="text"
            placeholder="Search menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Form.Group>
      </Form>

      <br></br>
      <Button className="mb-2" onClick={handleAdd}>Tambah Data</Button>
      
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editMenu ? "Edit Menu" : "Add Menu"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSave}>
          <Modal.Body>
            <Form.Group controlId="name">
              <Form.Label>Menu Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newMenu.name}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="image">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                onChange={handleImageChange}
              />
            </Form.Group>
            <Form.Group controlId="spicyLevel">
              <Form.Label>Spicy Level</Form.Label>
              <Form.Control
                type="text"
                name="spicy_level"
                value={newMenu.spicy_level}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={newMenu.price}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
            <Button variant="primary" type="submit">{editMenu ? "Save Changes" : "Add Menu"}</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Menu Name</th>
            <th>Image</th>
            <th>Spicy Level</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {menuList.map((item, index) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td><img src={item.image} alt={item.name} style={{ width: "100px", height: "100px" }} /></td>
              <td>{item.spicy_level}</td>
              <td>{item.price}</td>
              <td>
                <Button variant="info" size="sm" onClick={() => handleEdit(index)}>Edit</Button>{' '}
                <Button variant="danger" size="sm" onClick={() => handleDrop(item.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Menu;
