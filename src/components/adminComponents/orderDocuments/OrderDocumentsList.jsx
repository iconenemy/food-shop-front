import React, { useState, useEffect, useCallback, useContext } from "react";
import { Link } from "react-router-dom";

import NoteAddIcon from "@mui/icons-material/NoteAdd";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";

import OrderService from "../../../services/OrderService";
import OrderDocumentItem from "./OrderDocumentItem";
import StoreContext from "../../..";
import { Checkbox, FormControlLabel } from "@mui/material";

const modelKey = ["Id", "User", "Status", "Pyment Method", "Delivery Address"];

const OrderDocumentsList = ({ model }) => {
  const { store } = useContext(StoreContext);

  const [searchQuery, setSearchQuery] = useState("");
  
  const [filterList, setFilterList] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [documentList, setDocumentList] = useState([]);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const [statusQuery, setStatusQuery] = useState([]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getOrderList = useCallback(async () => {
    const response = await OrderService.getAll();
    if (store.role === "staff") {
      setDocumentList(
        response.data.docList.filter(
          (item) => item.status === "cancelled" || item.status === "processed"
        )
      );
      setFilterList(
        response.data.docList.filter(
          (item) => item.status === "cancelled" || item.status === "processed"
        )
      );
      setStatusList(["cancelled", "processed"]);
    } else {
      setDocumentList(response.data.docList);
      setFilterList(response.data.docList);
     
      const setStatus = new Set()
      response.data.docList.forEach((item) => {
        setStatus.add(item.status)
      })
      setStatusList([...setStatus.values()]);
    }
  }, [store]);

  useEffect(() => {
    getOrderList();
  }, [getOrderList]);

  const serchHandler = (e) => {
    e.preventDefault();
    setFilterList(
      documentList.filter((item) =>
        item.user.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  };

  const handleChange = (event) => {
    if (event.target.checked === true) {
      setStatusQuery((currentArray) => [...currentArray, event.target.value]);
    } else {
      setStatusQuery((currentArray) =>
        currentArray.filter((item) => item !== event.target.value)
      );
    }
  };

  const handleFilter = () => {
    console.log(statusQuery);
  };

  return (
    <>
      <Paper
        component="form"
        color="neutral"
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          width: 400,
          marginBottom: 2,
        }}
      >
        <IconButton
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          variant="neutral"
        >
          <FilterListIcon />
        </IconButton>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          sx={{ display: "flex", justifyContent: "center" }}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          {statusList.map((item) => (
            <MenuItem key={item}>
              <FormControlLabel
                control={<Checkbox value={item} onChange={handleChange} />}
                label={item}
              />
            </MenuItem>
          ))}
          <MenuItem>
            <Button
              variant="contained"
              endIcon={<SearchIcon />}
              onClick={handleFilter}
            >
              Find
            </Button>
          </MenuItem>
        </Menu>
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search orders by username"
          inputProps={{ "aria-label": "search orders by user" }}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <IconButton
          type="button"
          color="neutral"
          sx={{ p: "10px" }}
          onClick={serchHandler}
          aria-label="search"
        >
          <SearchIcon />
        </IconButton>
      </Paper>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ width: "20px" }}>
                {" "}
              </TableCell>
              {modelKey.map((item, index) => (
                <TableCell align="center" key={index}>
                  {item}
                </TableCell>
              ))}
              <TableCell align="center" sx={{ width: "20px" }}>
                {" "}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filterList.length > 0 &&
              filterList.map((item) => (
                <OrderDocumentItem key={item._id} model={model} item={item} />
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "end" }}>
        <Link
          to={`/admin/${model}/create`}
          style={{ textDecoration: "none", color: "white" }}
        >
          <Button
            color="neutral"
            variant="contained"
            endIcon={<NoteAddIcon />}
            sx={{ marginTop: "20px" }}
          >
            Add food item
          </Button>
        </Link>
      </Box>
    </>
  );
};

export default OrderDocumentsList;
