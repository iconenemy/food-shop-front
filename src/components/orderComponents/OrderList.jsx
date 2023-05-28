import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";

import {
  Button,
  Divider,
  Drawer,
  List,
  ListItem,
  Typography,
  useMediaQuery,
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import { Box } from "@mui/system";

import StoreContext from "../../index";
import OrderItem from "./OrderItem";
import TotalPriceOrder from "./TotalPriceOrder";

const OrderList = ({ cartOpen, closeCart }) => {
  const { store } = useContext(StoreContext);
  const desktop = useMediaQuery("(min-width:601px)");

  return (
    <Drawer anchor="right" open={cartOpen} onClose={closeCart}>
      <List
        sx={
          desktop ? { width: "350px", marginTop: "55px" } : { width: "300px" }
        }
      >
        <ListItem
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            borderBottom: "3px solid #ad160c",
            alignItems: "center",
          }}
        >
          <AddShoppingCartIcon sx={{ width: 35, height: 35 }} color="primary" />
          <Typography
            sx={{
              marginTop: "3px",
              marginLeft: 1,
              color: "#ad160c",
              textTransform: "uppercase",
              letterSpacing: "2px",
              fontSize: "20px",
            }}
            variant="h6"
          >
            Cart
          </Typography>
        </ListItem>
        {!store.order.size ? (
          <Typography align="center"
            sx={{
              marginTop: "50%",
              color: "#ad160c",
              textTransform: "uppercase",
              letterSpacing: "2px",
              fontSize: "13px",
            }}
            variant="h6"
          >
            You don't have any orders yet
          </Typography>
        ) : (
          <>
            {store.orderArray().map((item) => (
              <OrderItem key={item.name} id={item.name} qty={item.value} />
            ))}
            <Divider />
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginRight: 23,
                marginTop: 20,
              }}
            >
              <Typography variant="h6" color={"#ad160c"}>
                Total price: <TotalPriceOrder /> ₴
              </Typography>
            </div>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                marginRight: 1,
                paddingTop: 2,
              }}
            >
              <Link
                to="/issue-order"
                style={{ textDecoration: "none" }}
                onClick={closeCart}
              >
                <Button
                  variant="outlined"
                  color="primary"
                  endIcon={<ShoppingCartCheckoutIcon />}
                >
                  Make order
                </Button>
              </Link>
            </Box>
          </>
        )}
      </List>
    </Drawer>
  );
};

export default observer(OrderList);
