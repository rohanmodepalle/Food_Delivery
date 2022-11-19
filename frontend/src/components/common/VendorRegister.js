import { useState } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Visibility from "@material-ui/icons/Visibility";
import InputAdornment from "@material-ui/core/InputAdornment";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { IconButton } from "@mui/material";
import { Input } from "@mui/material";
import { Navigate, useNavigate } from "react-router-dom";

const VendorRegister = (props) => {
  const navigate = useNavigate();

  const [managerName, setManagerName] = useState("");
  const [shopName, setShopName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState(null);
  const [openTime, setOpenTime] = useState("");
  const [closeTime, setCloseTime] = useState("");
  const [values, setValues] = useState({
    password: "",
    showPassword: false,
  });
  const [confirmValues, setConfirmValues] = useState({
    password: "",
    showPassword: false,
  });

  const onChangeManagerName = (event) => {
    setManagerName(event.target.value);
  };

  const onChangeShopName = (event) => {
    setShopName(event.target.value);
  };

  const onChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const onChangeContact = (event) => {
    setContact(event.target.value);
  };

  const onChangeOpenTime = (event) => {
    setOpenTime(event.target.value);
  };

  const onChangeCloseTime = (event) => {
    setCloseTime(event.target.value);
  };

  const resetInputs = () => {
    setManagerName("");
    setShopName("");
    setEmail("");
    setContact("");
    setOpenTime("");
    setCloseTime("");
    setValues();
    setConfirmValues();
  };

  const onSubmit = (event) => {
    event.preventDefault();

    const newVendor = {
      managerName: managerName,
      shopName: shopName,
      email: email,
      contact: contact,
      openTime: openTime,
      closeTime: closeTime,
      password: values.password
    };

    axios
      .post("/api/vendor/register", newVendor)
      .then((response) => {
        alert("Created" + response.data.managerName);
        navigate("../login");
      });
    
    resetInputs();
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleClickShowConfirmPassword = () => {
    setConfirmValues({ ...confirmValues, showPassword: !confirmValues.showPassword });
  };
  
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  
  const handlePasswordChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleConfirmPasswordChange = (prop) => (event) => {
    setConfirmValues({ ...confirmValues, [prop]: event.target.value });
  };

  return (
    <Grid container align={"center"} spacing={2}>
      <Grid item xs={12}>
        <TextField
          label="Manager Name"
          variant="outlined"
          style={{width: 250}}
          value={managerName}
          onChange={onChangeManagerName}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Shop Name"
          variant="outlined"
          style={{width: 250}}
          value={shopName}
          onChange={onChangeShopName}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Email"
          variant="outlined"
          style={{width: 250}}
          value={email}
          onChange={onChangeEmail}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Contact"
          variant="outlined"
          style={{width: 250}}
          value={contact}
          type={"number"}
          InputProps={{ inputProps: { min: 1000000000, max: 9999999999 } }}
          onChange={onChangeContact}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Open Time (HH:MM format)"
          variant="outlined"
          style={{width: 250}}
          value={openTime}
          onChange={onChangeOpenTime}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Close Time (HH:MM format)"
          variant="outlined"
          style={{width: 250}}
          value={closeTime}
          onChange={onChangeCloseTime}
        />
      </Grid>
      <Grid item xs={12}>
      <TextField
        label="Password"
        type={values.showPassword ? "text" : "password"}
        onChange={handlePasswordChange("password")}
        value={values.password}
        style={{width: 250}}
        InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
            >
              {values.showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        ),
        }}
      />
      </Grid>
      <Grid item xs={12}>
      <TextField
        label="Confirm Password"
        type={confirmValues.showPassword ? "text" : "password"}
        onChange={handleConfirmPasswordChange("password")}
        value={confirmValues.password}
        style={{width: 250}}
        InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={handleClickShowConfirmPassword}
              onMouseDown={handleMouseDownPassword}
            >
              {confirmValues.showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        ),
        }}
      />
      </Grid>
      {values.password == confirmValues.password && values.password != "" && (
      <Grid item xs={12}>
        <Button variant="contained" onClick={onSubmit}>
          Register
        </Button>
      </Grid>
      )}
      {confirmValues.password != "" && values.password != confirmValues.password &&(
        <Grid item xs={12} style={{color: "red"}}>
            <p class="text-danger">Passwords don't match</p>
        </Grid>
      )}
    </Grid>
  );
};

export default VendorRegister;
