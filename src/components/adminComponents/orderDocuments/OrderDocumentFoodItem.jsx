import { TableCell } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import FoodItem from "../../../services/FoodItemService";

const OrderDocumentFoodItem = ({ itm, qty }) => {
  const [foodItem, setFoodItem] = useState({});
  const [price, setPrice] = useState('')

  const getFoodItem = useCallback(async () => {
    const response = await FoodItem.findOne(itm);
    setFoodItem(response.data.item);
    setPrice(response.data.item.price.$numberDecimal)
  }, [itm]);

  useEffect(() => {
    getFoodItem()
  }, [getFoodItem])

  return (
    <>
      <TableCell align="center"> </TableCell>
      <TableCell align="center">{itm}</TableCell>
      <TableCell align="center">{foodItem.name}</TableCell>
      <TableCell align="center">{qty}</TableCell>
      <TableCell align="center">{price}</TableCell>
    </>
  );
};

export default OrderDocumentFoodItem;
