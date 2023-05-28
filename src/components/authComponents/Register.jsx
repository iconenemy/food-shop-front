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
    <Typography variant="body2" color="#af120a" align="center" {...props}>
      {"Copyright © "} &nbsp;
      <Link color="inherit" to="/" style={{ color: "#af120a" }}>
        I C O N
      </Link>{" "}
      &nbsp;
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const Register = () => {
  const { store } = useContext(StoreContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState(
    Object.freeze({
      username: "",
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      phone_number: "",
      age: null,
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
    const response = await store.register(
      formData.username,
      formData.email,
      formData.password,
      formData.first_name,
      formData.last_name,
      formData.phone_number,
      formData.age
    );

    if (response?.data?.status === 201) navigate("/login");
  };

  useEffect(() => {
    store.setErrorStatus(null);
    store.setErrors([]);
  }, [store]);

  return (
    <Container component="main" maxWidth="xs" sx={{ marginBottom: 3 }}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "#af120a" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" color={"#af120a"}>
          Sign up
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="filled"
                sx={{ backgroundColor: "white" }}
                autoComplete="given-name"
                name="first_name"
                required
                fullWidth
                id="first_name"
                label="First Name"
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="filled"
                sx={{ backgroundColor: "white" }}
                required
                fullWidth
                id="last_name"
                label="Last Name"
                name="last_name"
                autoComplete="family-name"
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="filled"
                sx={{ backgroundColor: "white" }}
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="filled"
                sx={{ backgroundColor: "white" }}
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="filled"
                sx={{ backgroundColor: "white" }}
                required
                fullWidth
                id="password"
                label="Password"
                name="password"
                type="password"
                autoComplete="new-password"
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={8}>
              <TextField
                variant="filled"
                sx={{ backgroundColor: "white" }}
                required
                fullWidth
                id="phone_number"
                label="Phone number"
                name="phone_number"
                autoComplete="phonenumber"
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                variant="filled"
                sx={{ backgroundColor: "white" }}
                required
                fullWidth
                type="number"
                id="age"
                label="Age"
                name="age"
                autoComplete="age"
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
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
            </Grid>

            <Grid item xs={12}>
              {store.errorStatus === 400 && (
                <Typography
                  sx={{ color: "#d21976" }}
                  variant="caption"
                  display="block"
                >
                  *&nbsp;{store.errors.message}
                </Typography>
              )}
            </Grid>
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleSubmit}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="center">
            <Grid item sx={{ marginTop: 1 }}>
              <Link to="/login" variant="body2" style={{ color: "#af120a" }}>
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 5 }} />
    </Container>
  );
};

export default observer(Register);
