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
import { Rating } from "@mui/material";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";

const BuyerOrders = (props) => {
  const [orders, setOrders] = useState([]);
  const [fooditem, setFoodItem] = useState("");
  const [addons, setAddons] = useState([]);
  const [OpenViewAddons, setOpenViewAddons] = useState(false);
  const [order,setOrder] = useState(null);
  const [rating, setRating] = useState(0);
  const [isRated, setIsRated] = useState(false);

  useEffect(() => {
    const Email = {
        email: JSON.parse(localStorage.getItem("user")).email
    }

    axios
      .post("/api/order/search", Email)
      .then((response) => {
        let Orders = response.data;
        // let temp = []
        // for(let i = 0 ; Orders[i] != undefined ; i++)
        //   temp.push(0);
        setOrders(response.data);
        // setIsRated(temp);
      })
      .catch((error) => {
        console.log(error);
      });                                                              
  }, [isRated]);

  const HandlePickup = (order, ind) => {
    const Order = {
      buyeremail: order.buyeremail,
      time: order.time,
      status: "Completed",
    };

    axios 
      .post("/api/order/stage", Order)
      .then((response) => {
        alert("Status Updated");
        window.location.reload();
      })
      .catch((error) => {
        console.log(error.response);
        alert("Error " + error.response.status + error.response.data);
      })
  }

  const ViewAddons = (order) => {
    setFoodItem(order.fooditem);
    setAddons(order.addons);
    setOpenViewAddons(true);
  }

  const handleCloseViewAddons = () => {
    setOpenViewAddons(false);
  }

  const HandleRate = (order, ind) => {
    
    setFoodItem(order.fooditem);
    setIsRated(true);
    setOrder(order);
    // console.log(orders[ind]);
    // setIsRated(1);
  }

  const updateRating = () => {
    // console.log(orders[ind]);
    const Item = {
      name: order.fooditem,
      canteen: order.canteen,
      rating: rating
    };

    axios 
      .post("/api/fooditem/updaterating", Item)
      .then((response) => {
        let temp = isRated;
        setRating(0);
        setIsRated(false);
      })
      .catch((error) => {
        console.log(error.response);
        alert("Error " + error.response.status + error.response.data);
      })

    const Order = {
      buyeremail: order.buyeremail,
      time: order.time
    }
    
    axios 
      .post("/api/order/update", Order)
      .then((response) => {
        alert("Updated rating");
      })
      .catch((error) => {
        console.log(error.response);
        alert("Error " + error.response.status + error.response.data);
      })
  }

  return (
    <div>
      <Grid container spacing={"center"}>
        <Grid item xs={12}>
          <h1 align="center">My Orders</h1>
        </Grid>
        <Grid item xs={12}>
          <Paper>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: "bold"}} align="center" width={50}> Sr No</TableCell>
                  <TableCell style={{ fontWeight: "bold"}} align="center">Canteen</TableCell>
                  <TableCell style={{ fontWeight: "bold"}} align="center">Food Item</TableCell>
                  <TableCell style={{ fontWeight: "bold"}} align="center">Add-ons</TableCell>
                  <TableCell style={{ fontWeight: "bold"}} align="center">Price</TableCell>
                  <TableCell style={{ fontWeight: "bold"}} align="center">Quantity</TableCell>
                  <TableCell style={{ fontWeight: "bold"}} align="center">Time Placed</TableCell>
                  <TableCell style={{ fontWeight: "bold"}} align="center">Status</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order, ind) => (
                  <TableRow key={ind}>
                    <TableCell align="center">{ind + 1}</TableCell>
                    <TableCell align="center">{order.canteen}</TableCell>
                    <TableCell align="center">{order.fooditem}</TableCell>
          
                          {/* <Rating name="read-only" value={order.rating} readOnly/> */}
             
                    <TableCell align="center">
                      <Button variant="contained" style={{backgroundColor: "blue"}} onClick={() => ViewAddons(order)}>
                        View
                      </Button>
                    </TableCell>
                    <TableCell align="center">{"Rs " + order.price}</TableCell>
                    <TableCell align="center">{order.quantity}</TableCell> 
                    <TableCell align="center">{order.time}</TableCell>
                    <TableCell align="center">{order.status}</TableCell>
                    <TableCell align = "center">
                      {order.status == "Ready For Pickup" && (<Button variant="contained" color="success" onClick={() => HandlePickup(order, ind)}>PICK UP</Button>)} 
                      {(order.status == "Completed" && !order.isRated) && (<Button variant="contained" color="success" onClick={() => HandleRate(order, ind)}>RATE</Button>)} 
                      {isRated[ind] == 1 && (
                        <Rating
                          name="simple-controlled"
                          value={0}
                          onChange={(event, rating) => {
                          setRating(rating,ind);
                        }}
                        />
                      )}
                      </TableCell>
                      <Dialog open={OpenViewAddons} onClose={handleCloseViewAddons}>
                        <DialogTitle style={{height: 5}}>Add-ons for {fooditem}</DialogTitle>
                        <DialogContent style={{width: 400}}>
                        {addons.map((addon, i) => (
                        <Grid container>
                          <Grid item xs ={12} style={{height: 50}}>
                            <h5>Add-on {i+1}</h5>
                          </Grid>
                          <Grid item xs={6}>
                          <TextField 
                            autoFocus
                            margin="dense"
                            label={"Name"}
                            fullWidth
                            variant="outlined"
                            value={addons[i].name}
                            style={{width: 190}}
                          /> 
                          </Grid>
                          <Grid item xs={6}>
                          <TextField 
                            autoFocus
                            margin="dense"
                            label={"Price (in Rs)"}
                            fullWidth
                            variant="outlined"
                            value={addons[i].price}
                            style={{width: 190}}
                          /> 
                          </Grid>                          
                        </Grid>
                        ))}
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={handleCloseViewAddons}>Close</Button> 
                        </DialogActions>
                    </Dialog>
                    <Dialog open={isRated} onClose={() => {setIsRated(false);}}>
                    <DialogTitle>Rate {fooditem}</DialogTitle>
                    <DialogContent>
                      <Rating
                          name="simple-controlled"
                          size="large"
                          value={rating}
                          onChange={(event, rating) => {
                          setRating(rating);
                        }}
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => updateRating(ind)}>
                        OK
                      </Button>
                    </DialogActions>
                  </Dialog>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default BuyerOrders;