import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import BuyerRegister from './BuyerRegister';
import VendorRegister from './VendorRegister';
import Grid from '@mui/material/Grid';

const Register = (props) => {

  const [user, setUserType] = React.useState('');
  const [state, setState] = React.useState('');

  const handleChange = (event) => {
    setUserType(event.target.value);
    setState(event.target.value);
  };

  return (
    <div>
      <Grid container align={"center"} spacing={2}>
      <Grid item xs={12}>
        <h1>Register</h1>
      </Grid>
      <Grid item xs={12}>
      <FormControl sx={{ m: 1, minWidth: 250 }}>
        <InputLabel>User Type</InputLabel>
        <Select
          value={user}
          onChange={handleChange}
          autoWidth
          align="left"
          label="User Type"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem style={{width: 250}} value={'B'}>Buyer</MenuItem>
          <MenuItem style={{width: 250}} value={'V'}>Vendor</MenuItem>
        </Select>
      </FormControl>
      </Grid>
      {user == 'B' && (
        <Grid id="BuyerRegister" item xs={12}>
          <BuyerRegister />
        </Grid>
      )}
      {user == 'V' && (
        <Grid id="VendorRegister" item xs={12}>
          <VendorRegister />
        </Grid>
      )}
      </Grid>
    </div>
  );
};

export default Register;