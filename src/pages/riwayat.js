import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Modal, Table } from "react-bootstrap";

const Riwayat = () => {
  const [orderList, setOrderList] = useState([]);
  const [menuList, setMenuList] = useState([]);
  const [newOrder, setNewOrder] = useState({
    customer_name: "",
    table_number: "",
    order_date: "",
    order_detail: [],
  });
  const [showModal, setShowModal] = useState(false);
  const [editOrder, setEditOrder] = useState(null); // State to track the edited order item

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const orderResponse = await axios.get("http://172.16.100.39:8080/order", {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log(orderResponse);
      setOrderList(orderResponse.data.data);

      const menuResponse = await axios.get("http://172.16.100.39:8080/food", {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setMenuList(menuResponse.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleInputChange = (e) => {
    setNewOrder({ ...newOrder, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    setEditOrder(null); // Reset editOrder state
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewOrder({
      customer_name: "",
      table_number: "",
      order_date: "",
      order_detail: [],
    });
  };

  const handleEdit = (order) => {
    setEditOrder(order); // Set the order item to be edited
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (editOrder) {
      await updateOrder(editOrder.id);
    } else {
      await addOrder();
    }

    handleCloseModal();
  };

  const addOrder = async () => {
    try {
      const response = await axios.post(
        "http://172.16.100.39:8080/order",
        newOrder,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response.data);
      fetchData();
    } catch (error) {
      console.error("Error adding order:", error);
    }
  };

  const updateOrder = async (id) => {
    try {
      const response = await axios.put(
        `http://172.16.100.39:8080/order/${id}`,
        newOrder,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response.data);
      fetchData();
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const handleDrop = async (id) => {
    try {
      const response = await axios.delete(
        `http://172.16.100.39:8080/order/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response.data);
      fetchData();
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const calculateTotalPrice = (order) => {
    let totalPrice = 0;
    order.order_detail.forEach((detail) => {
      totalPrice += detail.price;
    });
    return totalPrice;
  };

  // Function to find the menu item by food_id
  const findMenuItem = (foodId) => {
    return menuList.find((item) => item.id === foodId);
  };

  return (
    <div className="container">
      <h4>Order History</h4>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editOrder ? "Edit Order" : "Add Order"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSave}>
          <Modal.Body>
            {/* Add form fields for order details */}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
            <Button variant="primary" type="submit">{editOrder ? "Save Changes" : "Add Order"}</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Order Date</th>
            <th>Customer Name</th>
            <th>Table Number</th>
            <th>Order Details</th>
            <th>Total Price</th>
          </tr>
        </thead>
        <tbody>
          {orderList?.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.order_date}</td>
              <td>{order.customer_name}</td>
              <td>{order.table_number}</td>
              <td>
                <ul>
                  {order.order_detail?.map((detail) => (
                    <li key={detail.id}>
                      {findMenuItem(detail.food_id) && findMenuItem(detail.food_id).name}
                    </li>
                  ))}
                </ul>
              </td>
              <td>{calculateTotalPrice(order)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Riwayat;
