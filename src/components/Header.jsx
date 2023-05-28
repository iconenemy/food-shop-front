import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";

import {
  AppBar,
  Box,
  IconButton,
  SwipeableDrawer,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Button from "@mui/material/Button";
import Badge from "@mui/material/Badge";
import CssBaseline from "@mui/material/CssBaseline";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";

import StoreContext from "../index";

const Header = ({ handleCart }) => {
  const { store } = useContext(StoreContext);
  const navigate = useNavigate();

  const desktop = useMediaQuery("(min-width:601px)");
  const mobile = useMediaQuery("(max-width:600px)");

  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  if (store.isLoading) {
    return <div>Loading...</div>;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    store.logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: "20" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {mobile && (
            <>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={handleDrawerOpen}
              >
                <MenuIcon />
              </IconButton>
              <SwipeableDrawer
                p={4}
                anchor="bottom"
                open={open}
                onOpen={handleDrawerOpen}
                onClose={handleDrawerClose}
                ModalProps={{
                  keepMounted: true,
                }}
              >
                <Box height="150px" textAlign="center">
                  {store.isAuth ? (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "column",
                        mt: "5%",
                      }}
                    >
                      <Box sx={{ mb: 2, ml: "43%" }}>
                        <Stack>
                          <Avatar
                            sx={{
                              bgcolor: "#ececec",
                              color: "#ad160c",
                              fontWeight: "bold",
                              width: 45,
                              height: 45,
                            }}
                            alt={store.username}
                            src="/broken-image.jpg"
                          >
                            {store.username[0].toUpperCase()}
                          </Avatar>
                        </Stack>
                      </Box>
                      <Box>
                        <Button
                          sx={{ pl: 10, pr: 10 }}
                          color="primary"
                          variant="contained"
                          onClick={handleSubmit}
                        >
                          Logout
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "6%",
                        flexDirection: "column",
                        gap: 2,
                      }}
                    >
                      <Link to="login" style={{ textDecoration: "none" }}>
                        <Button
                          sx={{ pl: 10, pr: 10 }}
                          color="primary"
                          variant="contained"
                          onClick={() => setOpen(false)}
                        >
                          Sign in
                        </Button>
                      </Link>
                      <Link to="register" style={{ textDecoration: "none" }}>
                        <Button
                          sx={{ pl: 10, pr: 10 }}
                          color="primary"
                          variant="contained"
                          onClick={() => setOpen(false)}
                        >
                          Sign up
                        </Button>
                      </Link>
                    </Box>
                  )}
                </Box>
              </SwipeableDrawer>
            </>
          )}
          <Box>
            <Link to="/" style={{ textDecoration: "none", color: "white" }}>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ gap: "5px" }}
              >
                <Typography fontFamily={"Sigmar"} variant="h4">
                  IC
                </Typography>
                <img
                  src="/images/logo2.png"
                  width={"50px"}
                  height={"50px"}
                  alt="logo"
                />
                <Typography fontFamily={"Sigmar"} variant="h4">
                  N
                </Typography>
              </IconButton>
            </Link>
          </Box>
          <Box>
            {desktop && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {store.isAuth && store.role === "admin" && (
                  <Link to="admin" style={{ textDecoration: "none" }}>
                    <IconButton
                      size="small"
                      edge="start"
                      sx={{ mr: 2, color: "white" }}
                    >
                      <AdminPanelSettingsIcon />
                      <Typography
                        variant="button"
                        component="div"
                        sx={{ ml: 1, flexGrow: 1 }}
                      >
                        Go to Admin
                      </Typography>
                    </IconButton>
                  </Link>
                )}
                {store.isAuth && store.role === "staff" && (
                  <Link to="admin/Order" style={{ textDecoration: "none" }}>
                    <IconButton
                      size="small"
                      edge="start"
                      sx={{ mr: 2, color: "white" }}
                    >
                      <AdminPanelSettingsIcon />
                      <Typography
                        variant="button"
                        component="div"
                        sx={{ ml: 1, flexGrow: 1 }}
                      >
                        Go to Admin
                      </Typography>
                    </IconButton>
                  </Link>
                )}
                {!store.isAuth ? (
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
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
                      <Button color="secondary" variant="outlined">
                        Sign up
                      </Button>
                    </Link>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "25px",
                      alignItems: "center",
                    }}
                  >
                    <Badge badgeContent={store.getOrderSize()} color="primary">
                      <ShoppingCartIcon
                        fontSize="large"
                        sx={{ padding: "2px" }}
                        onClick={handleCart}
                      />
                    </Badge>
                    <Stack spacing={1}>
                      <Avatar
                        sx={{
                          bgcolor: "#ececec",
                          color: "#ad160c",
                          fontWeight: "bold",
                          width: 35,
                          height: 35,
                        }}
                        alt={store.username}
                        src="/broken-image.jpg"
                      >
                        {store.username[0].toUpperCase()}
                      </Avatar>
                    </Stack>
                    <Button
                      color="secondary"
                      variant="outlined"
                      sx={{}}
                      onClick={handleSubmit}
                    >
                      Logout
                    </Button>
                  </Box>
                )}
              </Box>
            )}
            {mobile && store.isAuth && (
              <Badge badgeContent={store.getOrderSize()} color="primary">
                <ShoppingCartIcon
                  fontSize="large"
                  sx={{ padding: "2px" }}
                  onClick={handleCart}
                />
              </Badge>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default observer(Header);
