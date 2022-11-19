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
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";

const VendorOrders = (props) => {
  const [orders, setOrders] = useState([]);
  const [fooditem, setFoodItem] = useState("");
  const [addons, setAddons] = useState([]);
  const [OpenViewAddons, setOpenViewAddons] = useState(false);

  useEffect(() => {
    const Canteen = {
        canteen: JSON.parse(localStorage.getItem("user")).shopName
    }
    
    axios
      .post("/api/order", Canteen)
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const HandleReject = (order, ind) => {
    const Order = {
      buyeremail: order.buyeremail,
      time: order.time,
      status: "Rejected",
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

    const Buyer = {
      email: order.buyeremail,
      price: order.price
    };

    axios
      .post("/api/buyer/refundWallet", Buyer)
      .then((response) => {
        alert("Refunded to wallet");
        window.location.reload();
      })
      .catch((error) => {
        console.log(error.response);
        alert("Error " + error.response.status + error.response.data);
      })
  }

  const HandleStageChange = (order, ind) => {
    let Order = {
        buyeremail: order.buyeremail,
        time: order.time
      };

    let count = 0;
    for(let i = 0 ; orders[i] != undefined ; i++)
      if(orders[i].status == "Accepted" || orders[i].status == "Cooking")
        count++;

    if (order.status == "Placed" && count < 10){
      Order.status = "Accepted"
    }
    else if (order.status == "Accepted"){
      Order.status = "Cooking";
    }
    else if (order.status == "Cooking"){
      Order.status = "Ready For Pickup";
    }
    else
      alert("Cannot accept more than 10 orders at any time");

    axios 
        .post("/api/order/stage", Order)
        .then((response) => {
          alert("Status Updated");
        //   console.log(response.data);
          window.location.reload();
        })
        .catch((error) => {
          console.log(error.response);
          alert("Error " + error.response.status + error.response.data);
        })
  };

  const ViewAddons = (order) => {
    setFoodItem(order.fooditem);
    setAddons(order.addons);
    setOpenViewAddons(true);
  }

  const handleCloseViewAddons = () => {
    setOpenViewAddons(false);
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
                  <TableCell style={{ fontWeight: "bold"}} align="center">Customer email</TableCell>
                  <TableCell style={{ fontWeight: "bold"}} align="center">Food Item</TableCell>
                  <TableCell style={{ fontWeight: "bold"}} align="center">Add-ons</TableCell>
                  <TableCell style={{ fontWeight: "bold"}} align="center">Price</TableCell>
                  <TableCell style={{ fontWeight: "bold"}} align="center">Quantity</TableCell>
                  <TableCell style={{ fontWeight: "bold"}} align="center">Time Placed</TableCell>
                  <TableCell style={{ fontWeight: "bold"}} align="center">Status</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order, ind) => (
                  <TableRow key={ind}>
                    <TableCell align="center">{ind + 1}</TableCell>
                    <TableCell align="center">{order.buyeremail}</TableCell>
                    <TableCell align="center">{order.fooditem}</TableCell>
                    <TableCell align="center">
                      <Button variant="contained" style={{backgroundColor: "blue"}} onClick={() => ViewAddons(order)}>
                        View
                      </Button>
                    </TableCell>
                    <TableCell align="center">{"Rs " + order.price}</TableCell>
                    <TableCell align="center">{order.quantity}</TableCell> 
                    <TableCell align="center">{order.time}</TableCell>
                    <TableCell align="center">{order.status}</TableCell>
                    <TableCell align="center" width={200}> {(order.status != "Completed" && order.status != "Rejected" && order.status != "Ready For Pickup") && (<Button variant="contained" color="primary" onClick={() => HandleStageChange(order, ind)}>MOVE TO NEXT STAGE</Button>)}    
                    </TableCell>
                    <TableCell align="center" width={50}>
                      {order.status == "Placed" && (<Button variant="contained" color="error" onClick={() => HandleReject(order, ind)}>REJECT</Button>)} </TableCell>
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

export default VendorOrders;