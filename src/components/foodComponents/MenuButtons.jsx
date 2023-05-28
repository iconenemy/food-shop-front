import React, { useState, useCallback, useEffect, memo } from "react";
import { Link } from "react-router-dom";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import FoodService from "../../services/FoodService";

const MenuButtons = memo(() => {
  const [sections, setSections] = useState([]);
  const [buttonId, setButtonId] = useState(null);

  const handleClick = (event) => {
    setButtonId(event.target.outerText);
  };

  const getSectionList = useCallback(async () => {
    const response = await FoodService.getAllFoodSection();
    console.log('response:', response);
    setSections(
      response.data.list.filter(({ is_available }) => is_available === true)
    );
  }, []);

  useEffect(() => {
    getSectionList();
  }, [getSectionList]);

  return (
    <Box width={"100%"}>
      <Grid
        container
        spacing={1}
        sx={{ justifyContent: "center", marginBottom: 3 }}
      >
        {sections.map((item) => (
          <Grid item key={item._id} sm={4} xs={6} lg={2} sx={{ textAlign: "center" }}>
            <Link
              to={`/${item.name}`}
              key={item._id}
              state={{ data: item }}
              style={{
                textDecoration: "none",
                marginTop: "30px",
                color: "red",
              }}
            >
              {buttonId === item.name.toUpperCase() ? (
                <Button
                  size="small"
                  key={item._id}
                  id={item._id}
                  variant="contained"
                  fullWidth
                  onClick={handleClick}
                  defaultValue={item.name}
                >
                  <Typography variant="h6">{item.name}</Typography>
                </Button>
              ) : (
                <Button
                  size="small"
                  key={item._id}
                  id={item._id}
                  variant="outlined"
                  fullWidth
                  sx={{backgroundColor: 'white', border: '2px solid'}}
                  onClick={handleClick}
                >
                  <Typography variant="h6">{item.name}</Typography>
                </Button>
              )}
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
});

export default MenuButtons;
