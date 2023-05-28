import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import _ from "lodash";
import { Autocomplete, useLoadScript } from "@react-google-maps/api";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AutocompleteInput from "@mui/material/Autocomplete";

import StoreContext from "../../..";
import UserService from "../../../services/UserService";
import PaymentService from "../../../services/PaymentService";
import FoodItem from "../../../services/FoodItemService";
import OrderService from "../../../services/OrderService";

const statusList = ["new", "processed", "cancelled", "delivered"];
const libraries = ["places"];

const not = (a, b) => a.filter((value) => b.indexOf(value) === -1);

const intersection = (a, b) => a.filter((value) => b.indexOf(value) !== -1);

const OrderDocumentUpdate = ({ model, id }) => {
  const autocompleteRef = useRef();
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_API_KEY,
    libraries: libraries,
  });

  const navigate = useNavigate();
  const { store } = useContext(StoreContext);

  const [leftList, setLeftList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [rightList, setRightList] = useState([]);
  const [checked, setChecked] = React.useState([]);
  const [paymentList, setPaymentList] = useState([]);
  const [foodItemListAll, setFoodItemListAll] = useState([]);

  const [value, setValue] = useState(" ");
  const [status, setStatus] = useState("");
  const [payment, setPayment] = useState("");
  const [inputValue, setInputValue] = useState("");

  const leftChecked = intersection(checked, leftList);
  const rightChecked = intersection(checked, rightList);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleAllRight = () => {
    setRightList(rightList.concat(leftList));
    setLeftList([]);
  };

  const handleCheckedRight = () => {
    setRightList(rightList.concat(leftChecked));
    setLeftList(not(leftList, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeftList(leftList.concat(rightChecked));
    setRightList(not(rightList, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const handleAllLeft = () => {
    setLeftList(leftList.concat(rightList));
    setRightList([]);
  };

  const getUserList = useCallback(async () => {
    const response = await UserService.getAll();
    response.data.docList.forEach((item) =>
      setUserList((currentArray) => [
        ...currentArray,
        {
          value: item._id,
          label: item.username,
        },
      ])
    );
  }, []);

  const getPaymentMethodList = useCallback(async () => {
    const response = await PaymentService.getAll();
    response.data.docList.forEach((item) =>
      setPaymentList((currentArray) => [
        ...currentArray,
        {
          value: item._id,
          label: item.name,
        },
      ])
    );
  }, []);

  const getFoodItemListLeftSide = useCallback(async (id) => {
    const response = await OrderService.findOne(id);
    _.forEach(response.data.item.food_items, async (qty, key) => {
      const foodName = await FoodItem.findOne(key);
      setLeftList((currentArray) => [
        ...currentArray,
        { value: key, qty: qty, label: foodName.data.item.name },
      ]);
    });
  }, []);

  const getFoodItemListAll = useCallback(async () => {
    const response = await FoodItem.getAll();
    response.data.docList.forEach((item) =>
      setFoodItemListAll((currentArray) => [
        ...currentArray,
        { value: item._id, label: item.name, qty: 1 },
      ])
    );
  }, []);

  const difference = useCallback((firstList, secondList) => {
    const arr = _.differenceBy(firstList, secondList, "value");
    setRightList(arr);
  }, []);

  useEffect(() => {
    store.setErrorStatus(null);
    store.setErrors(null);
  }, [store]);

  useEffect(() => {
    difference(foodItemListAll, leftList);
  }, [difference, foodItemListAll, leftList]);

  useEffect(() => {
    getPaymentMethodList();
  }, [getPaymentMethodList]);

  useEffect(() => {
    getUserList();
  }, [getUserList]);

  useEffect(() => {
    getFoodItemListLeftSide(id);
  }, [getFoodItemListLeftSide, id]);

  useEffect(() => {
    getFoodItemListAll();
  }, [getFoodItemListAll]);

  const changePaymentMethod = (event) => {
    setPayment(event.target.value);
  };

  const reduceAmount = (event, id) => {
    setLeftList((currentArray) =>
      currentArray.map((item) =>
        item.value === id ? { ...item, qty: item.qty - 1 } : item
      )
    );
  };

  const increaseAmount = (event, id) => {
    setLeftList((currentArray) =>
      currentArray.map((item) =>
        item.value === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const changeStatus = (event) => {
    setStatus(event.target.value);
  };

  const handleDelete = async (event, id) => {
    event.preventDefault();

    const response = await OrderService.delete(id);
    if (response.data.status === 200) navigate(`/admin/${model}`);
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    const address = autocompleteRef.current.value;
    const map = new Map();
    leftList.map((item) => map.set(item.value, item.qty));
    if (address) {
      const response = await store.updateOrder(id, {
        user: value.value,
        food_items: [...map],
        status: status,
        payment_method: payment,
        address,
      });
      if (response.data.status === 200) navigate(`/admin/${model}`);
    } else {
      const response = await store.updateOrder(id, {
        user: value.value,
        food_items: [...map],
        status: status,
        payment_method: payment,
      });
      if (response.data.status === 200) navigate(`/admin/${model}`);
    }
  };

  const customList = (array, width = 220, leftSide = false) => (
    <Paper sx={{ width: width, height: 250, overflow: "auto" }}>
      <List dense component="div" role="list">
        {array.map((item) => {
          const labelId = `transfer-list-item-${item}-label`;

          return (
            <ListItem key={item.value} role="listitem">
              <ListItemIcon>
                <Checkbox
                  color="neutral"
                  onClick={handleToggle(item)}
                  checked={checked.indexOf(item) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    "aria-labelledby": labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={item.label} />
              {leftSide && (
                <Box
                  width="160px"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <IconButton
                    onClick={(event) => reduceAmount(event, item.value)}
                  >
                    <RemoveCircleOutlineIcon color="neutral" />
                  </IconButton>

                  <Typography variant="body1" color="#ad160c" width="10px">
                    {item.qty}
                  </Typography>

                  <IconButton
                    onClick={(event) => increaseAmount(event, item.value)}
                  >
                    <AddCircleOutlineIcon color="neutral" />
                  </IconButton>
                </Box>
              )}
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

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
          <DeliveryDiningIcon />
        </Avatar>
        <Typography component="h1" variant="h5" color={"#d21976"}>
          Edit order
        </Typography>
        <Box component="form" noValidate sx={{ mt: 3, width: 600 }}>
          <Grid
            container
            rowSpacing={1}
            justifyContent="center"
            spacing={0}
            sx={{ marginBottom: "20px", paddingLeft: "0px" }}
          >
            <Grid item xs={12}>
              <TextField
                color="neutral"
                required
                disabled
                fullWidth
                id="id"
                label="Id"
                name="id"
                value={id || ""}
                InputLabelProps={{ shrink: true }}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <AutocompleteInput
                value={value}
                onChange={(event, newValue) => {
                  setValue(newValue);
                }}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                  setInputValue(newInputValue);
                }}
                id="controllable-username"
                options={userList}
                sx={{ width: 600 }}
                isOptionEqualToValue={(option, value) =>
                  value === undefined || value === "" || option.id === value.id
                }
                renderInput={(params) => (
                  <TextField
                    fullWidth
                    color="neutral"
                    {...params}
                    label="Username"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sx={{ marginTop: "15px", marginBottom: "15px" }}>
              <Grid
                container
                spacing={1}
                justifyContent="center"
                alignItems="center"
              >
                <Grid item>{customList(leftList, 300, true)}</Grid>
                <Grid item>
                  <Grid container direction="column" alignItems="center">
                    <Button
                      sx={{ my: 0.5 }}
                      variant="outlined"
                      size="small"
                      onClick={handleAllRight}
                      disabled={leftList.length === 0}
                      aria-label="move all right"
                    >
                      ≫
                    </Button>
                    <Button
                      sx={{ my: 0.5 }}
                      variant="outlined"
                      size="small"
                      onClick={handleCheckedRight}
                      disabled={leftChecked.length === 0}
                      aria-label="move selected right"
                    >
                      &gt;
                    </Button>
                    <Button
                      sx={{ my: 0.5 }}
                      variant="outlined"
                      size="small"
                      onClick={handleCheckedLeft}
                      disabled={rightChecked.length === 0}
                      aria-label="move selected left"
                    >
                      &lt;
                    </Button>
                    <Button
                      sx={{ my: 0.5 }}
                      variant="outlined"
                      size="small"
                      onClick={handleAllLeft}
                      disabled={rightList.length === 0}
                      aria-label="move all left"
                    >
                      ≪
                    </Button>
                  </Grid>
                </Grid>
                <Grid item>{customList(rightList)}</Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <TextField
                color="neutral"
                id="outlined-select-status"
                fullWidth
                select
                label="Status"
                value={status}
                onChange={changeStatus}
              >
                {statusList.map((item, idx) => (
                  <MenuItem key={idx} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                color="neutral"
                id="outlined-select-payment-method"
                select
                label="Payment method"
                value={payment}
                onChange={changePaymentMethod}
              >
                {paymentList.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Autocomplete>
                <TextField
                  type="text"
                  color="neutral"
                  placeholder="Delivery address"
                  inputRef={autocompleteRef}
                  fullWidth
                />
              </Autocomplete>
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
            </Grid>

            <Grid item xs={12}>
              {store.errorStatus === 400 && (
                <Typography sx={{ color: "#d21976" }} variant="body2">
                  *&nbsp;{store.errors.message}
                </Typography>
              )}
            </Grid>
          </Grid>
          <Grid
            container
            spacing={1}
            justifyContent="space-between"
            alignItems="center"
          >
            <Grid item xs={4} sx={{ marginRight: 2 }}>
              <Button
                color="neutral"
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={(event) => handleDelete(event, id)}
              >
                delete
              </Button>
            </Grid>
            <Grid item xs={4} sx={{ marginLeft: 2 }}>
              <Button
                color="neutral"
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={(event) => handleUpdate(event)}
              >
                update
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default observer(OrderDocumentUpdate);
