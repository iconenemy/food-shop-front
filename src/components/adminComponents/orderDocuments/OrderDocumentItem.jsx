import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import _ from "lodash";

import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import OrderDocumentFoodItem from "./OrderDocumentFoodItem";

const tableHead = ["Id", "Name", "Amount", "Price per one"];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#d21976",
    color: "#fff",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const OrderDocumentItem = ({ item, model }) => {
  const [open, setOpen] = useState(false);
  const [foodItem, setFoodItem] = useState([]);

  const getFoodItems = useCallback(() => {
    _.forEach(item.food_items, (value, key) => {
      setFoodItem((prevArray) => [...prevArray, { key, value }]);
    });
  }, [item.food_items]);

  useEffect(() => {
    getFoodItems();
  }, [getFoodItems]);

  return (
    <>
      <TableRow
        key={item._id}
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      >
        <TableCell key={item._id}>
          <IconButton
            aria-label="expand row"
            size="small"
            color={!open ? "primary" : "secondary"}
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        <TableCell align="center"> {item._id} </TableCell>

        <TableCell align="center">{item.user.username}</TableCell>

        <TableCell align="center"> {item.status} </TableCell>

        <TableCell align="center"> {item.payment_method.name} </TableCell>

        <TableCell align="center">{item.address}</TableCell>

        <TableCell align="center" sx={{ color: "red" }}>
          <Link
            to={`/admin/${model}/${item._id}`}
            key={item._id}
            style={{ textDecoration: "none", marginTop: "30px", color: "red" }}
          >
            Edit
          </Link>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="orders">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center"> </StyledTableCell>
                    {tableHead.map((item, idx) => (
                      <StyledTableCell align="center" key={idx}>
                        {item}
                      </StyledTableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {foodItem.map((itm) => (
                    <TableRow key={itm.key}>
                      <OrderDocumentFoodItem
                        key={itm.key}
                        itm={itm.key}
                        qty={itm.value}
                      />
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default OrderDocumentItem;
