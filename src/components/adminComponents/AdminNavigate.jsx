import React, { useCallback, useContext, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";

import { Box, Toolbar } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import StorageIcon from "@mui/icons-material/Storage";

import AdminService from "../../services/AdminService";
import StoreContext from "../..";

const drawerWidth = 200;

const AdminHeader = () => {
  const { store } = useContext(StoreContext)
  const [adminModelList, setAdminModelList] = useState([]);
  const [staffModelList, setStaffModelList] = useState([]);

  const getModels = useCallback(async () => {
    const response = await AdminService.getModels();
    setAdminModelList(response.data.modelList);
    setStaffModelList(response.data.modelList.filter(item => item === 'Order'));
  }, []);

  useEffect(() => {
    getModels();
  }, [getModels]);

  return (
    <Drawer
      color="main"
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto" }} ml={"auto"} mr={"auto"} mt={1}>
        <List>
          {store.role === 'admin' && adminModelList.map((item) => (
            <ListItem key={item} disablePadding>
              <Link to={`/admin/${item}`} style={{ textDecoration: "none" }}>
                <ListItemButton sx={{ color: "#d21976" }}>
                  <ListItemIcon sx={{ color: "#d21976" }}>
                    <StorageIcon />
                  </ListItemIcon>
                  <ListItemText primary={item} />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
          {store.role === 'staff' && staffModelList.map((item) => (
            <ListItem key={item} disablePadding>
              <Link to={`/admin/${item}`} style={{ textDecoration: "none" }}>
                <ListItemButton sx={{ color: "#d21976" }}>
                  <ListItemIcon sx={{ color: "#d21976" }}>
                    <StorageIcon />
                  </ListItemIcon>
                  <ListItemText primary={item} />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default observer(AdminHeader);
