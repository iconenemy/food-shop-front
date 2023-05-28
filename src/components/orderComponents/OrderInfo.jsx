import React, { useContext } from "react";
import { observer } from "mobx-react-lite";

import StoreContext from "../..";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";

const OrderInfo = () => {
  const { store } = useContext(StoreContext);

  return (
    <Box
      width="100%"
      sx={{
        display: "flex",
        justifyContent: "center",
        border: "1px solid #ad160c",
        borderRadius: "10px",
        backgroundColor: "#fff",
      }}
    >
      <Box width="100%" sx={{ diplay: "inline", textAlign: "center" }}>
        <Typography
          variant="h6"
          maxWidth={"100%"}
          sx={{
            backgroundColor: "#ad160c",
            paddingTop: 2,
            paddingBottom: 2,
            color: "#fff",
            borderTopRightRadius: "10px",
            borderTopLeftRadius: "10px",
            marginBottom: 2,
          }}
        >
          Delivery Info
        </Typography>
        <Typography variant="h6" color="#ad160c" sx={{ marginBottom: 10 }}>
          {" "}
          Order №: {store.orderId}{" "}
        </Typography>
        <Box
          sx={{
            marginBottom: 2,
            display: "flex",
            justifyContent: "flex-start",
            ml: "2%",
          }}
        >
          <Typography variant="h6" color="#ad160c">
            Delivery time:{" "}
            {(store.durationTime + 300) / 3600 > 1 && (
              <>
                {Math.floor((store.durationTime + 300) / 3600)} h{" "}
                {Math.ceil(((store.durationTime + 300) % 3600) / 60)} m
              </>
            )}
            {(store.durationTime + 300) / 3600 < 1 && store.durationTime && (
              <>{Math.ceil((store.durationTime + 300) / 60)} m</>
            )}
          </Typography>
        </Box>

        <Typography variant="h6" color="#ad160c" align="start" sx={{ml: '2%', mb: 5}}>
          Delivery address: {store.destinationPlace}
        </Typography>

        <Typography variant="body1" color="#ad160c" sx={{ marginBottom: 1 }}>
          Within a few minutes our manager will contact you, clarify order
          details.
        </Typography>
      </Box>
    </Box>
  );
};

export default observer(OrderInfo);
