import { Button, Grid, Box, Typography, TextField} from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";
import { FormControl, InputLabel, Select, MenuItem, IconButton } from "@mui/material";
import { InputAdornment } from "@material-ui/core";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Visibility from "@material-ui/icons/Visibility";
import { useNavigate } from "react-router-dom";

const BuyerProfile = (props) => {
  const navigate = useNavigate();

  let user = JSON.parse(localStorage.getItem("user"));
  const [editState, setEditState] = useState(false);
  const [editPasswd, setEditPasswd] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [contact, setContact] = useState(user.contact);
  const [age, setAge] = useState(user.age);
  const [batch, setBatch] = useState(user.batch);
  const [error, setError] = useState(200);

  const [values, setValues] = useState({
    password: "",
    showPassword: false,
  });

  const [newvalues, setNewValues] = useState({
    password: "",
    showPassword: false,
  });

  const [confirmnewvalues, setConfirmNewValues] = useState({
    password: "",
    showPassword: false,
  });

  const onChangeName = (event) => {
    if (editState)
    {
      setName(event.target.value);
    }
  };

  const onChangeEmail = (event) => {
    if (editState)
    {
      setEmail(event.target.value);
    }
  };

  const onChangeContact = (event) => {
    if (editState)
    {
      setContact(event.target.value);
    }
  };

  const onChangeAge = (event) => {
    if (editState)
    {
      setAge(event.target.value);
    }
  };

  const onChangeBatch = (event) => {
    if (editState)
    {
      setBatch(event.target.value);
    }
  };

  const onEdit = () => {
    setEditState(true);
  }

  const onDone = () => {
    user.name = name;
    user.oldEmail = user.email;
    user.email = email;
    user.contact = contact;
    user.age = age;
    user.batch = batch;
    localStorage.removeItem("user");
    localStorage.setItem("user", JSON.stringify(user));

    axios
      .post("/api/buyer/edit", user)
      .then((response) => {
        alert("Successfully updated profile");
        setEditState(false);
      })
  }

  const onChangePass = () => {
    setEditPasswd(true);
  }

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleClickShowNewPassword = () => {
    setNewValues({ ...newvalues, showPassword: !newvalues.showPassword });
  };

  const handleClickShowConfirmNewPassword = () => {
    setConfirmNewValues({ ...confirmnewvalues, showPassword: !confirmnewvalues.showPassword });
  };
  
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  
  const handlePasswordChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleNewPasswordChange = (prop) => (event) => {
    setNewValues({ ...newvalues, [prop]: event.target.value });
  };

  const handleConfirmNewPasswordChange = (prop) => (event) => {
    setConfirmNewValues({ ...confirmnewvalues, [prop]: event.target.value });
  };

  const onVerify = () => {
    user.password = values.password;
    user.newPasswd = newvalues.password;

    axios
      .post("/api/buyer/editPasswd", user)
      .then((response) => {
        alert("Successfully updated password");
        navigate("/login");
      })
      .catch((error) => {
        setError(error.response.status);
        setValues({password: "", showPassword: false})
        setNewValues({password: "", showPassword: false})
        setConfirmNewValues({password: "", showPassword: false})
      })
  }

  return (
    <div>
    {!editPasswd && (
    <Grid container align={"center"} spacing={2}>
        <Grid item xs={12}>
            <h1>My Profile</h1>
        </Grid>
      <Grid item xs={12}>
        <TextField
          label="Name"
          variant="outlined"
          value={name}
          style={{width: 250}}
          onChange={onChangeName} 
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Email"
          variant="outlined"
          value={email}
          style={{width: 250}}
          onChange={onChangeEmail}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Contact"
          variant="outlined"
          value={contact}
          style={{width: 250}}
          onChange={onChangeContact}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Age"
          variant="outlined"
          value={age}
          style={{width: 250}}
          onChange={onChangeAge}
        />
      </Grid>
      {!editState && (
      <Grid item xs={12}>
        <TextField
          label="Batch"
          variant="outlined"
          value={batch}
          style={{width: 250}}
          onChange={onChangeBatch}
        />
      </Grid>
      )}
      {editState && (
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
      )}
      {!editState && (
      <Grid item xs={12}>
        <Button variant="contained" style={{width: 190}} onClick={onEdit}>
          Edit
        </Button>
      </Grid>
      )}
      {!editState && (
      <Grid item xs={12}>
        <Button variant="contained" style={{width: 190}} onClick={onChangePass}>
          Change Password
        </Button>
      </Grid>
      )}
      {editState && (
      <Grid item xs={12}>
        <Button variant="contained" style={{width: 190}} onClick={onDone}>
          Update
        </Button>
      </Grid>
      )}
      </Grid>
    )}
    {editPasswd && (
      <Grid container align={"center"} spacing={2}>
        <Grid item xs={12}>
      <TextField
        label="Current Password"
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
        label="New Password"
        type={newvalues.showPassword ? "text" : "password"}
        onChange={handleNewPasswordChange("password")}
        value={newvalues.password}
        style={{width: 250}}
        InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={handleClickShowNewPassword}
              onMouseDown={handleMouseDownPassword}
            >
              {newvalues.showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        ),
        }}
      />
      </Grid>
      <Grid item xs={12}>
      <TextField
        label="Confirm Password"
        type={confirmnewvalues.showPassword ? "text" : "password"}
        onChange={handleConfirmNewPasswordChange("password")}
        value={confirmnewvalues.password}
        style={{width: 250}}
        InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={handleClickShowConfirmNewPassword}
              onMouseDown={handleMouseDownPassword}
            >
              {confirmnewvalues.showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        ),
        }}
      />
      </Grid>
      {error == 401 && (
        <Grid item xs={12} style={{color: "red"}}>
            Password is incorrect
        </Grid>
      )}
      {newvalues.password == confirmnewvalues.password && newvalues.password != "" && (
      <Grid item xs={12}>
        <Button variant="contained" style={{width: 190}} onClick={onVerify}>
          Verify and Update
        </Button>
      </Grid>
      )}
      {confirmnewvalues.password != "" && newvalues.password != confirmnewvalues.password &&(
        <Grid item xs={12} style={{color: "red"}}>
            <p class="text-danger">Passwords don't match</p>
        </Grid>
      )} 
      </Grid>
    )}
    </div>
  );
};

export default BuyerProfile;