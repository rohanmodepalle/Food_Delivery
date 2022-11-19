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
import { useNavigate } from "react-router-dom";

const BuyerRegister = (props) => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState(null);
  const [age, setAge] = useState(null);
  const [batch, setBatch] = useState("");
//   const [password, setPasswd] = useState("");
  const [values, setValues] = useState({
    password: "",
    showPassword: false,
  });
  const [confirmValues, setConfirmValues] = useState({
    password: "",
    showPassword: false,
  });

  const onChangeUsername = (event) => {
    setName(event.target.value);
  };

  const onChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const onChangeContact = (event) => {
    setContact(event.target.value);
  };

  const onChangeAge = (event) => {
    setAge(event.target.value);
  };

  const onChangeBatch = (event) => {
    setBatch(event.target.value);
  };

//   const onChangePasswd = (event) => {
//     setPasswd(event.target.value);
//   }

  const resetInputs = () => {
    setName("");
    setEmail("");
    setContact("");
    setAge("");
    setBatch("");
    setValues({...values, showPassword: false});
    setConfirmValues({...confirmValues, showPassword: false});
  };

  const onSubmit = (event) => {
    event.preventDefault();

    const newBuyer = {
      name: name,
      email: email,
      contact: contact,
      age: age,
      batch: batch,
      password: values.password
    };

    axios
      .post("/api/buyer/register", newBuyer)
      .then((response) => {
        alert("Created" + response.data.name);
        navigate("../login")
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
          label="Name"
          variant="outlined"
          style={{width: 250}}
          value={name}
          onChange={onChangeUsername}
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
          type={"number"}
          InputProps={{ inputProps: { min: 1000000000, max: 9999999999 } }}
          style={{width: 250}}
          value={contact}
          onChange={onChangeContact}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Age"
          variant="outlined"
          style={{width: 250}}
          type={"number"}
          InputProps={{ inputProps: { min: 1 } }}
          value={age}
          onChange={onChangeAge}
        />
      </Grid>
      <Grid item xs={12}>
        <FormControl sx={{ m: 1, minWidth: 250 }}>
            <InputLabel id="demo-simple-select-autowidth-label">Batch</InputLabel>
            <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={batch}
          onChange={onChangeBatch}
          autoWidth
          align="left"
          label="Batch"
            >
            <MenuItem value="">
                <em>None</em>
            </MenuItem>
            <MenuItem style={{width: 250}} value={"UG1"}>UG1</MenuItem>
            <MenuItem style={{width: 250}} value={"UG2"}>UG2</MenuItem>
            <MenuItem style={{width: 250}} value={"UG3"}>UG3</MenuItem>
            <MenuItem style={{width: 250}} value={"UG4"}>UG4</MenuItem>
            <MenuItem style={{width: 250}} value={"UG5"}>UG5</MenuItem>
            </Select>
        </FormControl>
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

export default BuyerRegister;
