import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";

import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import HomeIcon from "@mui/icons-material/Home";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

import StoreContext from "../..";
import AdminNavigate from "./AdminNavigate";

const AdminHeader = () => {
  const { store } = useContext(StoreContext);
  const navigate = useNavigate();

  if (store.isLoading) {
    return <div>Loading...</div>;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    store.logout();
    navigate("/");
  };

  return (
    <Box sx={{ flexGrow: 1, justifyContent: "space-between" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box>
            <Link to="/admin" style={{ textDecoration: "none" }}>
              <IconButton
                size="large"
                edge="start"
                aria-label="menu"
                sx={{ mr: 2, color: "#d21976" }}
              >
                <AdminPanelSettingsIcon />
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ ml: 1, flexGrow: 1 }}
                >
                  Admin Panel
                </Typography>
              </IconButton>
            </Link>
          </Box>

          {!store.isAuth ? (
            <>
              <Link to="login" style={{ textDecoration: "none" }}>
                <Button
                  color="secondary"
                  variant="outlined"
                  sx={{ marginRight: 1 }}
                >
                  Sign in
                </Button>
              </Link>
              <Link to="register" style={{ textDecoration: "none" }}>
                <Button
                  color="secondary"
                  variant="outlined"
                  sx={{ textDecorationColor: "#d21976" }}
                >
                  Sign up
                </Button>
              </Link>
            </>
          ) : (
            <Box>
              <Link to="/" style={{ textDecoration: "none" }}>
                <IconButton
                  size="large"
                  edge="start"
                  aria-label="menu"
                  sx={{ mr: 2, color: "#d21976" }}
                >
                  <HomeIcon />
                  <Typography
                    variant="button"
                    component="div"
                    sx={{ ml: 1, flexGrow: 1 }}
                  >
                    Go to Main
                  </Typography>
                </IconButton>
              </Link>

              <Button
                color="secondary"
                variant="outlined"
                sx={{ marginRight: 1 }}
                onClick={handleSubmit}
              >
                Logout
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <AdminNavigate />
    </Box>
  );
};

export default observer(AdminHeader);
