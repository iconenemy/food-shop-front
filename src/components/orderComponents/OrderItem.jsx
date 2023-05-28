import React, { useEffect, useState, useCallback, useContext } from "react";
import { observer } from "mobx-react-lite";

import { IconButton, Typography } from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

import FoodService from "../../services/FoodService";
import StoreContext from "../../index";
import { Box } from "@mui/system";

const OrderItem = ({ id, qty }) => {
  const { store } = useContext(StoreContext);
  const [foodName, setFoodName] = useState({});

  const getFoodItem = useCallback(async (id) => {
    const response = await FoodService.getFoodItemById(id);
    setFoodName(response.data.item);
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
    <Box
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 9,
        paddingBottom: 9,
        marginLeft: "10px",
        width: '100%',
      }}
    >
      <div>
        <Typography variant="body1" color={"#ad160c"}>
          {foodName.name}
        </Typography>
      </div>

      <Box
        width="100px"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          marginRight: '2%'
        }}
      >
        <IconButton
          disabled={store.isOrderItemActive(id)}
          onClick={(event) => handleOrderPull(event, foodName._id)}
        >
          <RemoveCircleOutlineIcon color="primary" />
        </IconButton>

        <Typography variant="body1" color="#ad160c" width="10px">
          {qty}
        </Typography>

        <IconButton onClick={(event) => handleOrderAdd(event, foodName._id)}>
          <AddCircleOutlineIcon color="primary" />
        </IconButton>

        <IconButton
          onClick={(event) => handleOrderDelete(event, foodName._id)}
          sx={{ marginLeft: 1 }}
        >
          <HighlightOffIcon color="primary" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default observer(OrderItem);
