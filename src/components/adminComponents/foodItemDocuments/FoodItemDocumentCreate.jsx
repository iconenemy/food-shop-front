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
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

import StoreContext from "../../../index";
import FoodSectionService from "../../../services/FoodSectionService";

const FoodItemDocumentCreate = ({ model }) => {
  const { store } = useContext(StoreContext);
  const navigate = useNavigate();
  const [foodSectionList, setFoodSectionList] = useState([]);
  const [foodSection, setFoodSection] = useState("");
  const [selectedFile, setSelectedFile] = useState("");

  const [dataForm, setDataForm] = useState({
    name: "",
    ordering_priority: null,
    is_available: true,
    food_section: null,
    price: null,
    image: null,
  });

  const handleChange = (event) => {
    setDataForm({
      ...dataForm,
      [event.target.name]: event.target.value.trim(),
    });
  };

  const fileChangeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    dataForm.food_section = foodSection;
    const fd = new FormData();
    fd.append("file", selectedFile);

    Object.entries(dataForm).forEach((item) => {
      fd.append(item[0], item[1]);
    });
    const response = await store.createFoodItem(fd);
    if (response?.data?.status === 201) navigate(`/admin/${model}`);
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
    getFoodSectionList()
  }, [getFoodSectionList])

  useEffect(() => {
    store.setErrorStatus(null);
    store.setErrors(null);
  }, [store]);

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
          Create food item
        </Typography>
        <Box component="form" noValidate sx={{ mt: 3 }}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                color="neutral"
                autoComplete="given-name"
                required
                fullWidth
                id="name"
                name="name"
                label="Item Name"
                autoFocus
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
                name="price"
                label="Price"
                autoComplete="price"
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={11}>
              <TextField
                color="neutral"
                required
                fullWidth
                id="image"
                name="image"
                value={selectedFile.name || "put the image"}
                label="Image"
                autoComplete="Image"
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

            <Grid item>
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

            <Grid item>
              {store.errorStatus === 400 && (
                <Typography sx={{ color: "#d21976" }} variant="body2">
                  *&nbsp;{store.errors.message}
                </Typography>
              )}
            </Grid>
          </Grid>
          <Button
            color="neutral"
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleSubmit}
          >
            Create
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default observer(FoodItemDocumentCreate);
