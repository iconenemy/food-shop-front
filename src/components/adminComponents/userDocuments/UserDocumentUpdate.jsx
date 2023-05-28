import React, { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import EventRepeatRoundedIcon from "@mui/icons-material/EventRepeatRounded";
import PersonOffRoundedIcon from "@mui/icons-material/PersonOffRounded";

import UserService from "../../../services/UserService";
import StoreContext from "../../..";
import { MenuItem, Select } from "@mui/material";

const UserDocumentUpdate = ({ model, id }) => {
  const { store } = useContext(StoreContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState(
    Object.freeze({
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      password: "",
      phone_number: "",
      age: null,
      role: "",
      is_active: false,
    })
  );

  const getUserById = useCallback(async (id) => {
    const response = await UserService.findOne(id);
    setFormData({ ...response.data.item, password: "" });
  }, []);

  useEffect(() => {
    store.setErrorStatus(null);
    store.setErrors(null);
  }, [store]);

  useEffect(() => {
    getUserById(id)
  }, [getUserById, id])

  const checkboxChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.checked,
    });
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value.trim(),
    });
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    delete formData["_id"];
    const response = await store.updateUser(id, formData);
    if (response?.data?.status === 200) navigate(`/admin/${model}`);
  };

  const handleDelete = async (event) => {
    event.preventDefault();
    const response = await UserService.delete(id);
    if (response.data.status === 200) navigate(`/admin/${model}`);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "#d21976" }}>
          <ManageAccountsIcon />
        </Avatar>
        <Typography component="h1" variant="h5" color={"#d21976"}>
          Update user
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={handleUpdate}
          autoComplete="on"
          sx={{ mt: 3 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                color="neutral"
                required
                fullWidth
                id="id"
                label="Id"
                name="id"
                value={id || ""}
                InputLabelProps={{ shrink: true }}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                color="neutral"
                required
                fullWidth
                id="first_name"
                label="First Name"
                name="first_name"
                autoComplete="first_name"
                value={formData.first_name || ""}
                InputLabelProps={{ shrink: true }}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                color="neutral"
                required
                fullWidth
                id="last_name"
                label="Last Name"
                name="last_name"
                autoComplete="last_name"
                value={formData.last_name || ""}
                InputLabelProps={{ shrink: true }}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                color="neutral"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                value={formData.username || ""}
                InputLabelProps={{ shrink: true }}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                color="neutral"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formData.email || ""}
                InputLabelProps={{ shrink: true }}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                color="neutral"
                required
                fullWidth
                id="password"
                label="Password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={formData.password || ""}
                InputLabelProps={{ shrink: true }}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={8}>
              <TextField
                color="neutral"
                required
                fullWidth
                id="phone_number"
                label="Phone number"
                name="phone_number"
                autoComplete="phonenumber"
                value={formData.phone_number || ""}
                InputLabelProps={{ shrink: true }}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                color="neutral"
                required
                fullWidth
                id="age"
                label="Age"
                name="age"
                autoComplete="age"
                type="number"
                value={formData.age || ""}
                InputLabelProps={{ shrink: true }}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Select
                color="neutral"
                required
                fullWidth
                label="User role"
                name="role"
                autoComplete="role"
                value={formData.role || ""}
                InputLabelProps={{ shrink: true }}
                onChange={handleChange}
              >
                <MenuItem value={'guest'}>Guest</MenuItem>
                <MenuItem value={'admin'}>Admin</MenuItem>
                <MenuItem value={'staff'}>Staff</MenuItem>
              </Select>
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

              {store.errorStatus === 400 && (
                <Typography sx={{ color: "#d21976" }} variant="body2">
                  *&nbsp;{store.errors.message}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    color="neutral"
                    onChange={checkboxChange}
                    checked={formData.is_active}
                  />
                }
                label="isActive"
                name="is_active"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Button
                color="neutral"
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleDelete}
                endIcon={<PersonOffRoundedIcon />}
              >
                Delete
              </Button>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Button
                color="neutral"
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 3, mb: 2 }}
                onClick={handleUpdate}
                endIcon={<EventRepeatRoundedIcon />}
              >
                Update
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default observer(UserDocumentUpdate);
