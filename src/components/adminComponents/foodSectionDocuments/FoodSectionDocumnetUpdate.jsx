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
import MenuBookIcon from "@mui/icons-material/MenuBook";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import EventRepeatRoundedIcon from "@mui/icons-material/EventRepeatRounded";
import NoMealsIcon from "@mui/icons-material/NoMeals";

import FoodSectionService from "../../../services/FoodSectionService";
import StoreContext from "../../..";

const FoodSectionDocumentUpdate = ({ model, id }) => {
  const { store } = useContext(StoreContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState(
    Object.freeze({
      name: "",
      ordering_priority: null,
      is_available: false,
    })
  );

  const getFoodSectionById = useCallback(async (id) => {
    const response = await FoodSectionService.findOne(id);
    delete response.data.item["_id"];
    delete response.data.item["updatedAt"];
    delete response.data.item["createdAt"];
    setFormData(response.data.item);
  }, []);

  useEffect(() => {
    store.setErrorStatus(null);
    store.setErrors(null);
  }, [store]);

  useEffect(() => {
    getFoodSectionById(id);
  }, [getFoodSectionById, id]);

  const checkboxChangeHadler = (event) => {
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
    const response = await store.updateFoodSection(id, formData);
    if (response?.data?.status === 200) navigate(`/admin/${model}`);
  };

  const handleDelete = async (event) => {
    event.preventDefault();
    const response = await FoodSectionService.delete(id);
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
          <MenuBookIcon />
        </Avatar>
        <Typography component="h1" variant="h5" color={"#d21976"}>
          Update food section
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
                autoFocus
                id="name"
                label="Name"
                name="name"
                autoComplete="name"
                value={formData.name || ""}
                InputLabelProps={{ shrink: true }}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                color="neutral"
                required
                fullWidth
                type="number"
                id="ordering_priority"
                label="Priority"
                name="ordering_priority"
                autoComplete="ordering_priority"
                value={formData.ordering_priority || ""}
                InputLabelProps={{ shrink: true }}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={checkboxChangeHadler}
                    checked={formData.is_available}
                  />
                }
                label="isAvailable"
                name="is_available"
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

              {store.errorStatus === 400 && (
                <Typography sx={{ color: "#d21976" }} variant="body2">
                  *&nbsp;{store.errors.message}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
              <Button
                color="neutral"
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleDelete}
                endIcon={<NoMealsIcon />}
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

export default observer(FoodSectionDocumentUpdate);
