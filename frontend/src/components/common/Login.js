import * as React from 'react';
import axios from 'axios';
import { useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Grid';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Visibility from "@material-ui/icons/Visibility";
import InputAdornment from "@material-ui/core/InputAdornment";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { IconButton } from "@mui/material";
import { useNavigate } from 'react-router-dom';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const Login = (props) => {
  const navigate = useNavigate();

  const [user, setUserType] = useState('');
  const [state, setState] = useState('N');
  const [email, setEmail] = useState("");
  const [values, setValues] = useState({
    password: "",
    showPassword: false,
  });
  const [error, setError] = useState(200);
  const [status, setStatus] = useState("");

  const onChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const resetInputs = () => {
    setEmail("");
    setValues({...values, showPassword: false});
    setUserType('')
    setState('N')
  };

  const handleChange = (event) => {
    setUserType(event.target.value);
    setState(event.target.value);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const newUser = {
        email: email,
        password: values.password
      };

    // TransitionsModal();

    if (state == 'B') {
    
        axios
            .post("/api/buyer/login", newUser)
            .then((response) => {
                alert("Logged in as " + response.data.name);
                let user = {
                    email: email,
                    name: response.data.name,
                    contact: response.data.contact,
                    age: response.data.age,
                    batch: response.data.batch,
                    favs: response.data.favs,
                    balance: response.data.balance
                }

                localStorage.setItem("user", JSON.stringify(user));
                navigate("../buyer")
                })
                .catch((error) => {
                    setError(error.response.status);
                    setValues({password: "", showPassword: false})
            })
    }

    else if (state == 'V'){
        axios
            .post("/api/vendor/login", newUser)
            .then((response) => {
            alert("Logged in as " + response.data.managerName);
            const user = {
                email: email,
                managerName: response.data.managerName,
                shopName: response.data.shopName,
                contact: response.data.contact,
                openTime: response.data.openTime,
                closeTime: response.data.closeTime,
            }

            localStorage.setItem("user", JSON.stringify(user));
            navigate("../vendor")
            })
            .catch((error) => {
                setError(error.response.status);
                setValues({password: "", showPassword: false})
            })
    }
    }

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };
  
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  
  const handlePasswordChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  return (
    <div>
      <Grid container align={"center"} spacing={2}>
        <Grid item xs={12}>
            <h1>Login</h1>
        </Grid>
      <Grid item xs={12}>
      <FormControl sx={{ m: 1, minWidth: 250 }}>
        <InputLabel>User Type</InputLabel>
        <Select
          value={user}
          onChange={handleChange}   
          align="left"
          autoWidth
          label="User Type"
        >
          <MenuItem value={'N'}>
            <em>None</em>
          </MenuItem>
          <MenuItem style={{width: 250}} value={'B'}>Buyer</MenuItem>
          <MenuItem value={'V'}>Vendor</MenuItem>
        </Select>
      </FormControl>
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
        <Button variant="contained" onClick={onSubmit}>
          Login
        </Button>
      </Grid>
      {error == 404 && (
        <Grid item xs={12} style={{color: "red"}}>
            Email not found
        </Grid>
      )}
      {error == 401 && (
        <Grid item xs={12} style={{color: "red"}}>
            Password is incorrect
        </Grid>
      )}
      </Grid>
    </div>
  );
};

export default Login;