import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navigation1 from "../components/nav1";

const Cart = () => {
  const [orderDetail, setOrderDetail] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [tableNumber, setTableNumber] = useState("");

  useEffect(() => {
    const storedOrderDetail = localStorage.getItem("orderDetail");
    if (storedOrderDetail) {
      setOrderDetail(JSON.parse(storedOrderDetail));
    }
  }, []);

  const updateQuantity = (food_id, newQuantity) => {
    const updatedOrderDetail = orderDetail.map((item) =>
      item.food_id === food_id ? { ...item, quantity: newQuantity } : item
    );
    setOrderDetail(updatedOrderDetail);
    localStorage.setItem("orderDetail", JSON.stringify(updatedOrderDetail));
  };

  const removeFromOrderDetail = (food_id) => {
    const updatedOrderDetail = orderDetail.filter(
      (item) => item.food_id !== food_id
    );
    setOrderDetail(updatedOrderDetail);
    localStorage.setItem("orderDetail", JSON.stringify(updatedOrderDetail));
  };

  const handleCheckout = () => {
    const formattedOrderDetails = orderDetail.map(
      ({ food_id, quantity, price }) => ({
        food_id,
        quantity,
        price,
      })
    );
    const transactionData = {
      customer_name: customerName,
      table_number: tableNumber,
      order_date: new Date().toISOString(),
      order_detail: formattedOrderDetails,
    };

    axios
      .post("http://172.16.100.39:8080/order", transactionData)
      .then((response) => {
        localStorage.removeItem("orderDetail");
        setOrderDetail([]);
      })
      .catch((error) => {
        console.error("Error during checkout:", error);
      });
  };

  const calculateSubtotal = () => {
    return orderDetail.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    return subtotal * 0.1;
  };

  const calculateGrandTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  return (
    <div className="container cart-container">
      <h1 className="cart-title">Cart</h1>
      <div className="order-detail">
        <h2>Order Detail</h2>
        {orderDetail.map((item) => (
          <div className="card" key={item.food_id}>
            <img src={item.image} className="card-img-top" alt={item.name} />
            <div className="card-body">
              <h5 className="card-title">{item.name}</h5>
              <p className="card-text">Price: ${item.price}</p>
              <div className="quantity-controls">
                <button className="btn btn-danger" onClick={() => removeFromOrderDetail(item.food_id)}>
                  Remove
                </button>
                <button className="btn btn-secondary" onClick={() => updateQuantity(item.food_id, item.quantity - 1)}>
                  -
                </button>
                <span type="button" class="btn btn-outline-dark">{item.quantity}</span>
                <button className="btn btn-primary" onClick={() => updateQuantity(item.food_id, item.quantity + 1)}>
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div>
        <h2 className="customer-info">Customer Information</h2>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Table Number"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
        />
        <div>
          <h2 className="order-summary">Order Summary</h2>
          <p>Total Items: {orderDetail.length}</p>
          <p>Subtotal: ${calculateSubtotal().toFixed(2)}</p>
          <p>Tax (10%): ${calculateTax().toFixed(2)}</p>
          <p>Grand Total: ${calculateGrandTotal().toFixed(2)}</p>
        </div>
        <button className="btn btn-primary checkout-btn" onClick={handleCheckout}>
          Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
