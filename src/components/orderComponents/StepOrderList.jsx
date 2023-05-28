import React, { useContext } from "react";
import { observer } from "mobx-react-lite";

import StepOrderItem from "./StepOrderItem";
import StoreContext from "../../index";
import { Grid } from "@mui/material";

const StepOrderList = () => {
  const { store } = useContext(StoreContext);

  return (
    <Grid container spacing={2} sx={{display: 'flex', justifyContent: 'center'}}>
      {store.orderArray().map((item) => (
        <StepOrderItem key={item.name} id={item.name} qty={item.value} />
      ))}
    </Grid>
  );
};

export default observer(StepOrderList);
