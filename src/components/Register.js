import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";
import { useHistory, Link } from "react-router-dom";

const Register = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [username,setUsername]=useState("");
  const [password,setPassword]=useState("");
  const [confirmPassword,setConfirmPassword]=useState("");
  const [showloading,setShowLoading]=useState("");
  const history=useHistory();
  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function

  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */
  async function register(formData) {
    let newObj = {
      "username": formData.username,
      "password": formData.password
    };
    if (validateInput(formData)) {
      setShowLoading(true);
      try {
        let resp = await axios.post(`${config.endpoint}/auth/register`, newObj);
        if (resp) { enqueueSnackbar("Registed successfully", { variant: "success" }); }
        history.push("/login", { from: "Register" });
      }
      catch (e) {
        let obj = e.response;
        // console.log(e.response);
        if (obj.status >= 400) {
          // enqueueSnackbar("Username is already taken",{variant:"error"});
          enqueueSnackbar(obj.data.message, { variant: "error" });
        }

        else {
          enqueueSnackbar("Something went wrong.Check that the backend is running,reachable and returns valid JSON.", { variant: "error" });
        }
        // console.log(e.message);
        // alert(obj.data.message);
        setShowLoading(false);
      }
    }
  }
  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic

  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  const validateInput = (data) => {
    if(data.username===""){
      enqueueSnackbar("Username is a required field");
    }
    else if((data.username).length<6){
      enqueueSnackbar("Username must be at least 6 characters");
    }
    else if(data.password===""){
      enqueueSnackbar("Password is a required field");}
    else if((data.password).length<6){
        enqueueSnackbar("Password must be at least 6 characters");
    }
    else if(data.password!==data.confirmPassword){
      enqueueSnackbar("Passwords do not match");}
    else
    {return true;}
  };
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            value={username}
            onChange={(event) => {
              setUsername(event.target.value)}}
            placeholder="Enter Username"
            fullWidth
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            value={password}
            type="password"
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
            onChange={(event) => {
              setPassword(event.target.value)}}
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            value={confirmPassword}
            type="password"
            fullWidth
            onChange={(event) => {
              setConfirmPassword(event.target.value)}}
          />
           {!showloading && <Button className="button" variant="contained" onClick={()=>{register({
            "username":`${username}`,
            "password":`${password}`,
            "confirmPassword":`${confirmPassword}`
           })}}>
            Register Now
           </Button>}
           {showloading && <CircularProgress/>}
          <p className="secondary-action">
            Already have an account?{" "}
             <Link className="link" to='/login'>
              Login here
             </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
