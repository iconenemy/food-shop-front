import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

import StoreContext from "../../index";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="#af120a"
      align="center"
      {...props}
      style={{ marginBottom: "4" }}
    >
      {"Copyright © "} &nbsp;
      <Link to="/" style={{ color: "#af120a" }}>
        I C O N
      </Link>{" "}
      &nbsp;
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const Login = () => {
  const { store } = useContext(StoreContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState(
    Object.freeze({
      username: "",
      password: "",
    })
  );

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value.trim(),
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await store.login(formData.username, formData.password);
    if (store.role === "admin" && store.isAuth) {
      navigate("/admin");
    } else if (store.role === "staff" && store.isAuth) {
      navigate("/admin/Order");
    } else if (store.role === "guest" && store.isAuth) {
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    store.setErrorStatus(null);
    store.setErrors([]);
  }, [store]);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          paddingTop: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "#af120a" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" style={{ color: "#af120a" }}>
          Sign in
        </Typography>
        <Box
          component="form"
          autoComplete="off"
          onSubmit={handleSubmit}
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            variant="filled"
            sx={{ backgroundColor: "white" }}
            margin="normal"
            required
            fullWidth
            id="outlined-error-helper-text"
            label="Username"
            name="username"
            autoComplete="username"
            onChange={handleChange}
            autoFocus
          />
          <TextField
            variant="filled"
            sx={{ backgroundColor: "white", marginBottom: 2 }}
            margin="normal"
            type="password"
            required
            fullWidth
            id="password"
            label="Password"
            name="password"
            autoComplete="current-password"
            onChange={handleChange}
          />
          {store.errorStatus === 409 &&
            store.errors.map((item, idx) => (
              <Typography
                key={idx}
                sx={{ color: "#d21976" }}
                variant="caption"
                display="block"
              >
                *&nbsp;{item.message}
              </Typography>
            ))}

          {store.errorStatus === 400 && (
            <Typography sx={{ color: "#d21976" }} variant="body2">
              *&nbsp;{store.errors.message}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleSubmit}
          >
            Sign In
          </Button>
          <Grid container justifyContent="center">
            <Grid item sx={{ marginTop: 1 }}>
              <Link to="/register" variant="body2" style={{ color: "#af120a" }}>
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
};

export default observer(Login);
