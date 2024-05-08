import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Modal, Table } from "react-bootstrap";

const Riwayat = () => {
  const [orderList, setOrderList] = useState([]);
  const [menuList, setMenuList] = useState([]);

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
                      {findMenuItem(detail.food_id) && findMenuItem(detail.food_id).name} : {detail.quantity}
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
