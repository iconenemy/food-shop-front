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
import FoodBankIcon from "@mui/icons-material/FoodBank";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import EventRepeatRoundedIcon from "@mui/icons-material/EventRepeatRounded";
import NoMealsIcon from "@mui/icons-material/NoMeals";

import FoodItemService from "../../../services/FoodItemService";
import FoodSectionService from "../../../services/FoodSectionService";
import { IconButton } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import StoreContext from "../../..";

const FoodItemDocumnetUpdate = ({ model, id }) => {
  const { store } = useContext(StoreContext);
  const navigate = useNavigate();
  const [foodSectionList, setFoodSectionList] = useState([]);
  const [foodSection, setFoodSection] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const [formPrice, setFormPrice] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    ordering_priority: null,
    is_available: false,
    image: ''
  });

  const getFoodItemById = useCallback(async (id) => {
    const response = await FoodItemService.findOne(id);
    setFormPrice(response.data.item.price.$numberDecimal);
    delete response.data.item["price"];
    setFormData(response.data.item);
  }, []);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value.trim(),
    });
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    delete formData["_id"];
    formData.food_section = foodSection;

    const fd = new FormData();
    Object.entries(formData).forEach((item) => {
      fd.append(item[0], item[1]);
    });

    if (selectedFile) {
      fd.append("file", selectedFile);
    }

    const response = await store.updateFoodItem(id, fd);
    if (response?.data?.status === 200) navigate(`/admin/${model}`);
  };

  const handleDelete = async (event) => {
    event.preventDefault();

    const response = await FoodItemService.delete(id);
    if (response.data.status === 200) navigate(`/admin/${model}`);
  };

  const getFoodSectionList = useCallback(async () => {
    const response = await FoodSectionService.getAll();
    response.data.docList.forEach((item) =>
      setFoodSectionList((currentArray) => [
        ...currentArray,
        {
          value: item._id,
          label: item.name,
        },
      ])
    );
  }, []);

  useEffect(() => {
    store.setErrorStatus(null);
    store.setErrors(null);
  }, [store]);

  useEffect(() => {
    getFoodItemById(id);
  }, [getFoodItemById, id]);

  useEffect(() => {
    getFoodSectionList();
  }, [getFoodSectionList]);

  const checkboxChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.checked,
    });
  };

  const fileChangeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const priceChangeHandler = (event) => {
    setFormPrice(event.target.value);
  };

  const changeFoodSection = (event) => {
    setFoodSection(event.target.value);
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
          <FoodBankIcon />
        </Avatar>
        <Typography component="h1" variant="h5" color={"#d21976"}>
          Update food item
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

            <Grid item xs={12}>
              <TextField
                color="neutral"
                required
                fullWidth
                id="name"
                label="Item Name"
                name="name"
                autoComplete="name"
                value={formData.name || ""}
                InputLabelProps={{ shrink: true }}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                color="neutral"
                id="outlined-select-currency"
                fullWidth
                select
                label="Food Section"
                value={foodSection}
                onChange={changeFoodSection}
              >
                {foodSectionList.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                color="neutral"
                required
                fullWidth
                type="number"
                id="ordering_priority"
                name="ordering_priority"
                label="Ordering Priority"
                autoComplete="family-name"
                value={formData.ordering_priority || ""}
                InputLabelProps={{ shrink: true }}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                color="neutral"
                required
                fullWidth
                type="number"
                id="price"
                label="Price"
                name="price"
                autoComplete="price"
                value={formPrice || ""}
                InputLabelProps={{ shrink: true }}
                onChange={priceChangeHandler}
              />
            </Grid>

            <Grid item xs={11}>
              <TextField
                color="neutral"
                required
                fullWidth
                id="image"
                name="image"
                label="Image"
                autoComplete="Image"
                value={selectedFile.name || formData.image}
                InputLabelProps={{ shrink: true }}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={1} sx={{ marginTop: 1 }}>
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="label"
              >
                <input
                  hidden
                  accept="image/*, .png, .jpg, .web"
                  type="file"
                  onChange={fileChangeHandler}
                />
                <PhotoCamera color="neutral" />
              </IconButton>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={checkboxChange}
                    checked={formData.is_available}
                  />
                }
                label="isAvailable"
                name="is_available"
              />
            </Grid>

            <Grid item xs={12} sm={12}>
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

            <Grid item xs={6} sm={6}>
              <Button
                color="neutral"
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 2, pl: 4, pr: 4 }}
                onClick={handleDelete}
                endIcon={<NoMealsIcon />}
              >
                Delete
              </Button>
            </Grid>

            <Grid item xs={6} sm={6}>
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

export default observer(FoodItemDocumnetUpdate);
