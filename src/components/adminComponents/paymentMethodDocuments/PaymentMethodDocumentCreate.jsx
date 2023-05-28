import React, { useContext, useEffect, useState } from "react";
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
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

import StoreContext from "../../..";

const PaymentMethodDocumentCreate = ({ model }) => {
  const { store } = useContext(StoreContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState(Object.freeze({ name: "" }));

  useEffect(() => {
    store.setErrorStatus(null);
    store.setErrors(null);
  }, [store]);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value.trim(),
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await store.createPaymentMethod(formData);
    if (response?.data?.status === 201) navigate(`/admin/${model}`);
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
        <Typography
          component="h1"
          variant="h5"
          color={"#d21976"}
          sx={{ marginBottom: 5 }}
        >
          Create payment method
        </Typography>
        <Box component="form" noValidate sx={{ mt: 3 }}>
          <Grid container spacing={1}>
            <Grid width={"300px"} item xs={12}>
              <TextField
                color="neutral"
                autoComplete="given-name"
                required
                fullWidth
                id="name"
                name="name"
                label="Payment name"
                autoFocus
                onChange={handleChange}
              />
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

export default observer(PaymentMethodDocumentCreate);
