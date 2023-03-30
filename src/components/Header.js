import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {Search} from "@mui/icons-material";
import {
  Avatar,
  Button,
  Stack,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Link, useHistory } from "react-router-dom";
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const history = useHistory();
  const check = () => {
    if (!localStorage.getItem("username")) {
      return false;
    }
    return true;
  };
  const handleBack = () => {
    history.push("/");
  };
  const handleLogin = () => {
    history.push("/login", { from: "/" });
  };
  const handleRegister = () => {
    history.push("/register", { from: "/" });
  };
  const handleLogout = () => {
    localStorage.clear();
    history.push("/");
  };
  return (
    <Box className="header">
      <Box className="header-title">
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>
      {children}
      {hasHiddenAuthButtons ? (
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={handleBack}
        >
          Back to explore
        </Button>
      ) : !check() ? (
        <Box>
            <Button
              className="Login-button"
              variant="text"
              onClick={handleLogin}
            >
              LOGIN
            </Button>
            <Button
              className="Register-button"
              variant="contained"
              onClick={handleRegister}
            >
              REGISTER
            </Button>
        </Box>
      ) : (
        <Box>
          <Button
            startIcon={
              <Avatar alt={localStorage.getItem("username")} src="avatar.png" />
            }
            variant="text"
            id="name-btn"
          >
            {localStorage.getItem("username")}
          </Button>
          <Button
            className="Register-button"
            variant="text"
            onClick={handleLogout}
          >
            LOGOUT
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Header;
