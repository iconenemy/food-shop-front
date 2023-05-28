import React, { useContext } from "react";
import { observer } from "mobx-react-lite";

import StepOrderList from "./StepOrderList";
import GoogleMapRender from "./GoogleMap";
import OrderPayment from "./OrderPayment";
import { Button, Divider, Typography } from "@mui/material";
import TotalPriceOrder from "./TotalPriceOrder";
import { Box } from "@mui/system";

import StoreContext from "../..";
import OrderService from "../../services/OrderService";
import { useNavigate } from "react-router-dom";

const IssueOrder = () => {
  const { store } = useContext(StoreContext);
  const navigate = useNavigate();

  const handleSumbit = async (event) => {
    event.preventDefault();

    const formData = {
      user: store.userId,
      food_items: store.order,
      status: "new",
      payment_method: store.payment,
      orginal_place: store.originPlace,
      address: store.destinationPlace,
    };

    const response = await OrderService.create(formData);
    if (response.data.status === 201) {
      store.clearOrder();
      store.setOrderId(response.data.id);
      navigate("/order-info");
    }
  };

  return (
    <>
      <Typography
        variant="h6"
        color="#fff"
        sx={{
          marginBottom: 2,
          paddingLeft: 2,
          paddingTop: 1,
          paddingBottom: 1,
          backgroundColor: "#ad160c",
          justifyContent: "center",
          display: "flex",
        }}
      >
        {" "}
        Items{" "}
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <StepOrderList />
      </Box>
      <Divider sx={{ marginTop: 4, marginBottom: 4 }} />
      <Typography
        variant="h6"
        color="#ad160c"
        sx={{ display: "flex", justifyContent: "flex-end" }}
      >
        Total price <TotalPriceOrder /> ₴
      </Typography>
      <Typography
        variant="h6"
        color="#fff"
        sx={{
          marginBottom: 3,
          marginTop: 5,
          paddingLeft: 2,
          paddingTop: 1,
          paddingBottom: 1,
          backgroundColor: "#ad160c",
          justifyContent: "center",
          display: "flex",
        }}
      >
        {" "}
        Delivery info{" "}
      </Typography>
      <GoogleMapRender />
      <Typography
        variant="h6"
        color="#fff"
        sx={{
          marginBottom: 3,
          marginTop: 5,
          paddingLeft: 2,
          paddingTop: 1,
          paddingBottom: 1,
          backgroundColor: "#ad160c",
          justifyContent: "center",
          display: "flex",
        }}
      >
        {" "}
        Payment method{" "}
      </Typography>
      <Box
        width="100%"
        sx={{ display: "flex", justifyContent: "center", marginBottom: 5 }}
      >
        <OrderPayment />
      </Box>
      <Box
        width="100%"
        sx={{ display: "flex", justifyContent: "center", marginBottom: 7 }}
      >
        <Button
          size="large"
          variant="contained"
          onClick={handleSumbit}
          sx={{ pl: 10, pr: 10 }}
        >
          Accept
        </Button>
      </Box>
    </>
  );
};

export default observer(IssueOrder);
