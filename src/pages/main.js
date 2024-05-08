import React from "react";
import { Routes, Route} from "react-router-dom";

import ProtectedRoutes from "../protect/protectedroutes";
import Login from "./login";
import Menu from "./menu";
import Riwayat from "./riwayat";
import Dashboard from "./dashboard";
import Cart from "./cart";
import Navigation from "../components/nav";
import Navigation1 from "../components/nav1";

const Main = () => {
    return (
      <>
        {<Navigation1 />}
        <Routes>
          <Route exact path="/" element={<Dashboard />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
        {localStorage.getItem("token")&& <Navigation />}       
        <Routes>
          <Route element={<ProtectedRoutes />}>
            <Route path="/menu" element={<Menu />} />
            <Route path="/riwayat" element={<Riwayat />} />
          </Route>
        </Routes>
      </>
    );
}

export default Main;
