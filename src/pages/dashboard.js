import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Form, Button, Modal, Table } from "react-bootstrap";
import Navigation1 from "../components/nav1";

const Dashboard = () => {
  const [menuList, setMenuList] = useState([]);
  const [orderDetail, setOrderDetail] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    localStorage.setItem("orderDetail", JSON.stringify(orderDetail));
  }, [orderDetail]);

  useEffect(() => {
    const storedOrderDetail = localStorage.getItem("orderDetail");
    if (storedOrderDetail) {
      setOrderDetail(JSON.parse(storedOrderDetail));
    }
  }, []);

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

  const addToOrderDetail = (food_id, price) => {
    const existingItemIndex = orderDetail.findIndex(
      (item) => item.food_id === food_id
    );
    if (existingItemIndex !== -1) {
      const updatedOrderDetail = [...orderDetail];
      updatedOrderDetail[existingItemIndex].quantity += 1;
      setOrderDetail(updatedOrderDetail);
    } else {
      setOrderDetail([
        ...orderDetail,
        {
          food_id: food_id,
          price: price,
          quantity: 1,
        },
      ]);
    }
  };

  const removeFromOrderDetail = (food_id) => {
    const updatedOrderDetail = orderDetail.map((item) => {
      if (item.food_id === food_id) {
        return {
          ...item,
          quantity: Math.max(0, item.quantity - 1),
        };
      }
      return item;
    });
    setOrderDetail(updatedOrderDetail.filter((item) => item.quantity > 0));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchData(); // Trigger data fetching when form is submitted
  };

  return (
    <div className="container">
      <h1>Menu Ayam</h1>
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
      <div className="row">
        {menuList.map((menu) => (
          <div className="col-md-3 mb-3" key={menu.id}>
            <div className="card">
              <div className="card-body">
                <img src={menu.image} className="img" alt={menu.name} height="200" />
                <h6 className="card-title">{menu.name}</h6>
                <h6 className="card-title">{menu.spicy_level}</h6>
                <p className="card-text">Rp {menu.price}</p>
                <div className="menu-item-actions">
                  <button className="btn btn-outline-primary btn-sm" onClick={() => removeFromOrderDetail(menu.id)}>
                    -
                  </button>
                  <span className="quantity">
                    {orderDetail.find((item) => item.food_id === menu.id)
                      ?.quantity || 0}
                  </span>
                  <button className="btn btn-outline-primary btn-sm" onClick={() => addToOrderDetail(menu.id, menu.price)}>
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
