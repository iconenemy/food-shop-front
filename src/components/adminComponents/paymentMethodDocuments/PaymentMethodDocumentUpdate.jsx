import React, { useCallback, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { observer } from "mobx-react-lite";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import EventRepeatRoundedIcon from "@mui/icons-material/EventRepeatRounded";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CreditCardOffIcon from "@mui/icons-material/CreditCardOff";

import StoreContext from "../../..";
import PaymentService from "../../../services/PaymentService";

const PaymentMethodDocumentUpdate = ({ model, id }) => {
  const { store } = useContext(StoreContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState(Object.freeze({ name: "" }));

  const getFoodSectionById = useCallback(async (id) => {
    const response = await PaymentService.findOne(id);
    delete response.data.item["_id"];
    setFormData(response.data.item);
  }, []);

  useEffect(() => {
    store.setErrorStatus(null);
    store.setErrors(null);
  }, [store]);

  useEffect(() => {
    getFoodSectionById(id);
  }, [getFoodSectionById, id]);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    const response = await store.updatePaymentMethod(id, formData);
    if (response?.data?.status === 200) navigate(`/admin/${model}`);
  };

  const handleDelete = async (event) => {
    event.preventDefault();
    const response = await PaymentService.delete(id);
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
          <AccountBalanceIcon />
        </Avatar>
        <Typography component="h1" variant="h5" color={"#d21976"}>
          Update payment method
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
                endIcon={<CreditCardOffIcon />}
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

export default observer(PaymentMethodDocumentUpdate);
