import React from "react";
import {Grid} from "@mui/material";
import {useNavigate} from "react-router-dom";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Button as MuiButton,
} from "@mui/material";
import ReplyIcon from '@mui/icons-material/Reply';

const Button = styled(MuiButton)(spacing);

const theme = createTheme({
  palette: {
    secondary: {
      main: "#BA0C2F",
    },
  },
});

const InventoryOnHand = () => {
  const navigate = useNavigate();
  return (
    <>
      <Grid container spacing={6}>
        <Grid item>
          <ThemeProvider theme={theme}>
            <Button
              mr={2}
              variant="contained"
              color="secondary"
              onClick={() => navigate("/plan")}
            >
              <ReplyIcon />
            </Button>
          </ThemeProvider>
        </Grid>
      </Grid>
      <br />
      <Grid container justifyContent="center" spacing={1} alignItems="stretch" sx={{ minHeight: "800px" }}>
        <Grid item md={12} zeroMinWidth>
          <iframe title="2. Warehouse Status Report - Warehouses" width="100%" height="100%"
                  src="https://app.powerbi.com/view?r=eyJrIjoiN2UwMTExMjAtZmIxNi00YzdkLWJlNDUtMmI0MjVkNjQwMjNiIiwidCI6ImU3OTQyOTc0LTk3MzgtNGE0YS1iNjQ2LTJhYjkwZjc5ZGIwZiIsImMiOjF9"
                  frameBorder="0" allowFullScreen="true"></iframe>
        </Grid>
      </Grid>
    </>
  );
};
export default InventoryOnHand;