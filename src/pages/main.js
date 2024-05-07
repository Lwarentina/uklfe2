import React from "react";
import {Route, Routes } from "react-router-dom";

import Login from "./login";
import Menu from "./menu";
import Riwayat from "./riwayat";

class Main extends React.Component {
  render() {
    return (
      <Routes>
        <Route exact path="/" element={<Login/>} />
        <Route path="/menu" element={<Menu/>} />
        <Route path="/riwayat" element={<Riwayat/>} />
      </Routes>
    );
  }
}

export default Main;
