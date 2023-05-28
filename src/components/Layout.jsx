import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { observer } from "mobx-react-lite";
import Container from "@mui/material/Container";

import Header from "./Header";
import { Toolbar } from "@mui/material";

import OrderList from "./orderComponents/OrderList";
import "../index.css";

const Layout = () => {
  const [isCartOpen, setCartOpen] = useState(false);

  return (
    <>
      <Header handleCart={() => setCartOpen(true)} />
      <Toolbar />
      <Container
        sx={{ paddingTop: 5, display: "column", alignItems: "center" }}
      >
        <Outlet />
        <OrderList cartOpen={isCartOpen} closeCart={() => setCartOpen(false)} />
      </Container>
    </>
  );
};

export default observer(Layout);
