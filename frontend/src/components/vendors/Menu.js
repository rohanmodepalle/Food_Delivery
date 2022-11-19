import { useState, useEffect } from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import Button from "@mui/material/Button";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from "@mui/material/TextField";
import CancelIcon from "@mui/icons-material/Cancel";
import { InputAdornment, IconButton } from "@material-ui/core"; 
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const VendorsList = (props) => {
  const [fooditems, setFoodItems] = useState([]);
  const [tags, setTags] = useState([]);
  const [addons, setAddons] = useState([]);
  const [updateState, setUpdateState] = useState(false);
  const [OpenEdit, setOpenEdit] = useState(false);
  const [OpenViewTags, setOpenViewTags] = useState(false);
  const [OpenViewAddons, setOpenViewAddons] = useState(false);
  const [OpenAddItem, setOpenAddItem] = useState(false);

  const [name, setName] = useState("");
  const [oldname, setOldName] = useState("");
  const [type, setType] = useState("");
  const [price, setPrice] = useState(null);
  const [rating, setRating] = useState(null);

  useEffect(() => {
    const Canteen = {
      canteen: JSON.parse(localStorage.getItem("user")).shopName
    }
    
    axios
      .post("/api/fooditem", Canteen)
      .then((response) => {
        setFoodItems(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleItemUpdate = (item) => {
    const foodItem = {
      name: name,
      oldname: oldname,
      canteen: item.canteen,
      price: price,
      type: type,
    }

    axios
      .post("/api/fooditem/updateitem", foodItem)
      .then((response) => {
        setUpdateState(false);
        alert("Successfully updated food item");
        handleCloseEdit();
      })
      .catch((error) => {
        console.log(error)
        alert(error.response);
      })
  }

  const handleCloseDelete = (item) => {
    window.location.reload();
  }

  const handleItemDelete = (item) => {
    const foodItem = {
      name: item.name,
      canteen: item.canteen
    }

    axios
      .post("/api/fooditem/deleteitem", foodItem)
      .then((response) => {
        alert("Successfully deleted food item");
        handleCloseDelete();
      })
      .catch((error) => {
        console.log(error)
        alert(error.response);
      })
  }

  const onAddItem = () => {
    setOpenAddItem(true);
    setName("");
    setType("");
    setPrice("");
  }

  const handleAddItem = () => {
    const foodItem = {
      name: name,
      canteen: JSON.parse(localStorage.getItem("user")).shopName,
      type: type,
      price: price,
      rating: 0,
      tags: [],
      addons: []
    }

    console.log(foodItem);

    axios
      .post("/api/fooditem/additem", foodItem)
      .then((response) => {
        alert("Successfully added food item");
        handleCloseAdd();
      })
      .catch((error) => {
        console.log(error)
        alert(error.response);
      })
  }

  const onEdit = (item) => {
    setName(item.name);
    setOldName(item.name);
    setType(item.type);
    setPrice(item.price);
    setOpenEdit(true);
  }

  const handleCloseAdd = () => {
    setOpenAddItem(false);
    window.location.reload();
  }

  const handleCloseEdit = () => {
    setOpenEdit(false);
    window.location.reload();
  }

  const handleCloseViewTags = () => {
    setOpenViewTags(false);
    window.location.reload();
  };

  const handleCloseViewAddons = () => {
    setOpenViewAddons(false);
    window.location.reload();
  };

  const onChangeName = (event) => {
    setName(event.target.value);
  }

  const onChangeType = (event) => {
    setType(event.target.value);
  }

  const onChangePrice = (event) => {
    setPrice(event.target.value);
  }

  const onChangeRating = (event) => {
    setRating(event.target.value);
  }

  const ViewTags = (item) => {
    setName(item.name);
    setTags(item.tags);
    setOpenViewTags(true);
  }

  const EditTag = () => {
    setUpdateState(true);
  }

  const updateTag = (item) => {
    const foodItem = {
      name: name,
      canteen: item.canteen,
      tags: tags
    }

    axios
      .post("/api/fooditem/updatetags", foodItem)
      .then((response) => {
        setUpdateState(false);
        alert("Successfully updated tags");
        handleCloseViewTags();
      })
      .catch((error) => {
        console.log(error)
        alert(error.response);
      })
  }

  const deleteTag = (i) => {
    const temptags = [...tags];
    temptags.splice(i, 1);
    setTags(temptags);
  }

  const onChangeTag = (event,i) => {
    if(updateState)
    {
      const temptags = [...tags];
      temptags[i] = event.target.value;
      setTags(temptags);
    }     
  }

  const addTag = () =>{
    const temptags = [...tags];
    temptags.push("");
    setTags(temptags);
  }

  const ViewAddons = (item) => {
    setName(item.name);
    setAddons(item.addons);
    setOpenViewAddons(true);
  }

  const onChangeAddonName = (event,i) => {
    if(updateState)
    {
      const tempaddons = [...addons];
      tempaddons[i].name = event.target.value;
      setTags(tempaddons);
    }     
  }

  const onChangeAddonPrice = (event,i) => {
    if(updateState)
    {
      const tempaddons = [...addons];
      tempaddons[i].price = event.target.value;
      setTags(tempaddons);
    }     
  }

  const updateAddon = (item) => {
    const foodItem = {
      name: name,
      canteen: item.canteen,
      addons: addons
    }

    axios
      .post("/api/fooditem/updateaddons", foodItem)
      .then((response) => {
        setUpdateState(false);
        alert("Successfully updated addons");
        handleCloseViewAddons();
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const deleteAddon = (i) => {
    const tempaddons = [...addons];
    tempaddons.splice(i, 1);
    setAddons(tempaddons);
  }

  const addAddon = () => {
    const tempaddons = [...addons];
    tempaddons.push({
      name: "",
      price: ""                                                                 
    });
    setAddons(tempaddons);
  }

  return (
    <div>                                                                              
      <Grid container>
        <Grid item xs={12}>
            <h1 align="center">Menu</h1>
        </Grid>
        <Grid item xs={12}>
            <Button variant="contained" color="success" style={{"margin-bottom": "10px", backgroundColor: "yellowgreen"}} onClick={onAddItem}>
                Add Item
            </Button>
        </Grid>
        <Grid item xs={12}>
          <Paper>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="center" width={50} style={{fontWeight:"bold"}}>Sr No</TableCell>
                  <TableCell align="center" style={{fontWeight:"bold"}}>Name</TableCell>
                  <TableCell align="center" style={{fontWeight:"bold"}}>Type</TableCell>
                  <TableCell align="center" style={{fontWeight:"bold"}}>Price</TableCell>
                  <TableCell align="center" style={{fontWeight:"bold"}}>Rating</TableCell>
                  <TableCell align="center" style={{fontWeight:"bold"}}>Tags</TableCell>
                  <TableCell align="center" style={{fontWeight:"bold"}}>Add-ons</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fooditems.map((item, ind) => (
                  <TableRow key={ind}>
                    <TableCell align="center">{ind + 1}</TableCell>
                    <TableCell align="center">{item.name}</TableCell>
                    <TableCell align="center">{item.type}</TableCell>
                    <TableCell align="center">Rs. {item.price}</TableCell>
                    <TableCell align="center">{item.rating == 0 ? item.rating : item.rating.toPrecision(2)}</TableCell>
                    <TableCell align="center">
                        <Button variant="contained" style={{backgroundColor: "blue"}} onClick={() => ViewTags(item)}>
                          {item.tags.length > 0 ? "View" : "Add"}
                        </Button>
                    </TableCell>
                    <TableCell align="center">
                        <Button variant="contained" style={{backgroundColor: "blue"}} onClick={() => ViewAddons(item)}>
                            {item.addons.length > 0 ? "View" : "Add"}
                        </Button>
                    </TableCell>
                    <TableCell align="right" width={200}>
                        <Button variant="contained" style={{"margin-right": "10px", backgroundColor: "yellowgreen"}} onClick={() => onEdit(item)}>
                            Edit
                        </Button>
                        <Button variant="contained" color="error" onClick={() => handleItemDelete(item)}>
                            Delete
                        </Button>
                    </TableCell>
                        <Dialog open={OpenEdit} onClose={handleCloseEdit}>
                            <DialogTitle>Edit Food Item</DialogTitle>
                            <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Name"
                                type="email"
                                fullWidth
                                variant="outlined"
                                value={name}
                                onChange={onChangeName}
                            />
                            <FormControl style={{width: 553, "margin-top": "10px"}}>
                              <InputLabel>Type</InputLabel>
                              <Select
                                value={type}
                                onChange={onChangeType}   
                                align="left"
                                autoWidth
                                label="Type"
                              >
                                <MenuItem style={{width: 553}} value={"Veg"}>Veg</MenuItem>
                                <MenuItem value={"Non-Veg"}>Non-Veg</MenuItem>
                              </Select>
                            </FormControl>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Price"
                                type="email"
                                fullWidth
                                variant="outlined"
                                style={{width: 553, "margin-top": "10px"}}
                                value={price}
                                onChange={onChangePrice}
                            />
                            </DialogContent>
                            <DialogActions>
                            <Button onClick={handleCloseEdit}>Cancel</Button>
                            <Button onClick={() => handleItemUpdate(item)}>Update</Button>
                            </DialogActions>
                        </Dialog>
                        <Dialog open={OpenViewTags} onClose={handleCloseViewTags}>
                            <DialogTitle>Tags</DialogTitle>
                            <DialogContent style={{width: 200}}>
                            {tags.map((tag, i) => (
                            <TextField
                                autoFocus
                                margin="dense"
                                label={"Tag " + (i+1)}
                                fullWidth
                                variant="outlined"
                                value={tags[i]}
                                onChange={(event) => onChangeTag(event,i)}
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      {updateState ?
                                      <IconButton onClick={() => deleteTag(i)}>
                                        <CancelIcon />
                                      </IconButton>
                                      :<></>}
                                    </InputAdornment>
                                  ),
                                  }}
                            />
                            ))}
                            </DialogContent>
                            <DialogActions>
                            <Button onClick={handleCloseViewTags}>Cancel</Button>
                            {(!updateState) && (
                              <Button onClick={EditTag}>Edit</Button>
                            )}
                            {(updateState) && (
                              <Button onClick={addTag}>Add Item</Button>
                            )}  
                            {updateState && (
                              <Button onClick={() => updateTag(item)}>Update</Button>
                            )}  
                            </DialogActions>
                        </Dialog>
                        <Dialog open={OpenViewAddons} onClose={handleCloseViewAddons}>
                            <DialogTitle style={{height: 5}}>Add-ons</DialogTitle>
                            <DialogContent style={{width: 400}}>
                            {addons.map((addon, i) => (
                            <Grid container>
                              <Grid item xs ={12} style={{height: 50}}>
                                <h5>Add-on {i+1}</h5>
                              </Grid>
                              <Grid item xs={updateState ? 5 : 6}>
                              <TextField 
                                autoFocus
                                margin="dense"
                                label={"Name"}
                                fullWidth
                                variant="outlined"
                                value={addons[i].name}
                                style={updateState ? {width: 160} : {width: 190}}
                                onChange={(event) => onChangeAddonName(event,i)}
                              /> 
                              </Grid>
                              <Grid item xs={updateState ? 5 : 6}>
                              <TextField 
                                autoFocus
                                margin="dense"
                                label={"Price (in Rs)"}
                                fullWidth
                                variant="outlined"
                                value={addons[i].price}
                                style={updateState ? {width: 160} : {width: 190}}
                                onChange={(event) => onChangeAddonPrice(event,i)}
                              /> 
                              </Grid>
                                {updateState ? 
                                  <Grid item xs={1}>
                                  <IconButton onClick={() => deleteAddon(i)} align="right" style={{"margin-top": "10px"}}>
                                    <CancelIcon />
                                  </IconButton>
                                  </Grid>
                                : <></>}
                              
                            </Grid>
                            ))}
                            </DialogContent>
                            <DialogActions>
                            <Button onClick={handleCloseViewAddons}>Cancel</Button>
                            {!updateState && (
                              <Button onClick={EditTag}>Edit</Button>
                            )}
                            {updateState && (
                              <Button onClick={addAddon}>Add Item</Button>
                            )}  
                            {updateState && (
                              <Button onClick={() => updateAddon(item)}>Update</Button>
                            )}  
                            </DialogActions>
                        </Dialog>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
          <Dialog open={OpenAddItem} onClose={handleCloseAdd}>
              <DialogTitle>Add Food Item</DialogTitle>
              <DialogContent>
              <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  label="Name"
                  type="email"
                  fullWidth
                  variant="outlined"
                  value={name}
                  onChange={onChangeName}
              />
              <FormControl style={{width: 553, "margin-top": "10px"}}>
                <InputLabel>Type</InputLabel>
                <Select
                  value={type}
                  onChange={onChangeType}   
                  align="left"
                  autoWidth
                  label="Type"
                >
                  <MenuItem style={{width: 553}} value={"Veg"}>Veg</MenuItem>
                  <MenuItem value={"Non-Veg"}>Non-Veg</MenuItem>
                </Select>
              </FormControl>
              <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  label="Price"
                  type="email"
                  fullWidth
                  variant="outlined"
                  style={{width: 553, "margin-top": "10px"}}
                  value={price}
                  onChange={onChangePrice}
              />
              </DialogContent>
              <DialogActions>
              <Button onClick={handleCloseAdd}>Cancel</Button>
              <Button onClick={handleAddItem}>Add</Button>
              </DialogActions>
          </Dialog>
        </Grid>
      </Grid>
    </div>
  );
};

export default VendorsList;
