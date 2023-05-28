import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#ad160c",
    },
    secondary: {
      light: "#F5F5F5",
      main: "#FFF",
      contrastText: "#F5F5F5",
    },
    custom: {
      main: "#d21976",
      contrastText: "#fff",
    },
  },
  neutral: {
    main: "#d21976",
    contrastText: "#fff",
  },
  components: {
    ListItemIcon: {
      variants: [
        {
          props: { color: "primary" },
        },
      ],
    },
    Button: {},
  },
  typography: {
    fontFamily: ["Quicksand", "Roboto", "Sigmar, cursive"].join(","),
  },
});
