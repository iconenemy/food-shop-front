import React, { useState, useEffect, useCallback, useContext } from "react";
import { observer } from "mobx-react-lite";

import { Box, MenuItem, TextField } from "@mui/material";

import PaymentService from "../../services/PaymentService";
import StoreContext from "../..";

const OrderPayment = () => {
  const { store } = useContext(StoreContext);
  const [paymentList, setPaymentList] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");

  const getPaymentMethods = useCallback(async () => {
    const response = await PaymentService.getAll();
    response.data.docList.forEach((item) =>
      setPaymentList((currentArray) => [
        ...currentArray,
        { value: item._id, label: item.name },
      ])
    );
  }, []);

  useEffect(() => {
    getPaymentMethods();
  }, [getPaymentMethods]);

  const changePaymentMethod = (event) => {
    setPaymentMethod(event.target.value);
    store.setPayment(event.target.value);
  };

  return (
    <Box sx={{ width: "350px"}}>
      <TextField
      sx={{backgroundColor: "#fbf7f3"}}
        id="outlined-select-currency"
        fullWidth
        select
        label="Payment method"
        value={paymentMethod}
        onChange={changePaymentMethod}
      >
        {paymentList.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
};

export default observer(OrderPayment);
