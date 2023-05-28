import React, { useContext, useState, useCallback, useEffect } from "react";

import {
  Card,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Box } from "@mui/system";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import AddBoxIcon from "@mui/icons-material/AddBox";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";

import FoodService from "../../services/FoodService";
import StoreContext from "../../index";

const StepOrderItem = ({ id, qty }) => {
  const { store } = useContext(StoreContext);
  const desktop = useMediaQuery("(min-width:601px)");
  const mobile = useMediaQuery("(max-width:600px)");
  const [foodItem, setFoodItem] = useState({});
  const [price, setPrice] = useState(0);

  const getFoodItem = useCallback(async (id) => {
    const response = await FoodService.getFoodItemById(id);
    setFoodItem(response.data.item);
    setPrice(response.data.item.price.$numberDecimal);
  }, []);

  const handleOrderAdd = (event, id) => {
    event.preventDefault();
    store.handleOrderAdd(id);
  };

  const handleOrderPull = (event, id) => {
    event.preventDefault();
    store.handleOrderPull(id);
  };

  const handleOrderDelete = (event, id) => {
    event.preventDefault();
    store.handleOrderDelete(id);
  };

  useEffect(() => {
    getFoodItem(id);
  }, [getFoodItem, id]);

  return (
    <Grid item sm={12} md={6} xs={12} key={foodItem._id}>
      <Card
        sx={
          (desktop && {
            display: "flex",
            width: "100%",
            border: "2px solid #ad160c",
          }) ||
          (mobile && {
            display: "flex",
            flexDirection: "column",
            width: "100%",
            alignItems: "center",
            border: "2px solid #ad160c",
          })
        }
      >
        <CardMedia
          component="img"
          sx={
            (desktop && { width: 150 }) ||
            (mobile && { width: "200px", height: "200px", mt: 3 })
          }
          image={`images/${foodItem.image}`}
          alt="Live from space album cover"
        />
        <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: 1
            }}
          >
            <Typography component="div" variant="h5" color={"#ad160c"} width={'200px'}>
              {foodItem.name}
            </Typography>
            <Typography variant="h5" color="#ad160c" component="div">
              {price} ₴
            </Typography>
          </CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
              pl: 1,
              pb: 1,
            }}
          >
            <Box sx={{ width: "150px", display: "flex", alignItems: "center" }}>
              <IconButton
                disabled={store.isOrderItemActive(foodItem._id)}
                color="primary"
                sx={{ marginRight: 1 }}
                onClick={(event) => handleOrderPull(event, foodItem._id)}
              >
                <IndeterminateCheckBoxIcon />
              </IconButton>

              <Typography variant="h6" color={"#ad160c"}>
                {qty}
              </Typography>

              <IconButton
                color="primary"
                sx={{ marginLeft: 1 }}
                onClick={(event) => handleOrderAdd(event, foodItem._id)}
              >
                <AddBoxIcon />
              </IconButton>
            </Box>
            <IconButton
              color="primary"
              sx={{ marginRight: 2 }}
              onClick={(event) => handleOrderDelete(event, foodItem._id)}
            >
              <DisabledByDefaultIcon />
            </IconButton>
          </Box>
        </Box>
      </Card>
    </Grid>
  );
};

export default StepOrderItem;
