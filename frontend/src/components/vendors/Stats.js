import React, { useEffect, useState } from "react";
import axios from "axios";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import { Grid, Typography } from "@mui/material";

export default function Stats () {

    const [orders, setOrders] = useState([]);
    const [fooditems, setFoodItems] = useState([]);
    const [topSoldItems, setTopSoldItems] = useState([]);
    const [countPlacedOrders, setCountPlacedOrders] = useState(0);
    const [countPendingOrders, setCountPendingOrders] = useState(0);
    const [countCompletedOrders, setCountCompletedOrders] = useState(0);
    const [Temp,setTemp] = useState(false);
    
    useEffect(() => {
        const Canteen = {
            canteen: JSON.parse(localStorage.getItem("user")).shopName
        }

        // let fooditems = [];
        axios
            .post("/api/fooditem", Canteen)
            .then((response) => {
                setFoodItems(response.data);
            })
            .catch((error) => {
            console.log(error);
            })

        axios
            .post("/api/order", Canteen)
            .then((response) => {
                setOrders(response.data);
            })
            .catch((error) => {
            console.log(error);
            })
        
        let temp = fooditems;
        temp.sort((a,b) => {
            if(a.orderCount >= b.orderCount)
                return 1;
            else
                return -1;
        });
        setFoodItems(temp);

        console.log(temp);

        temp = [];
        for(let i = fooditems.length - 1 ; i > fooditems.length - 6 && fooditems[i] != undefined ; i--)
            if(fooditems[i].orderCount > 0)
                temp.push(fooditems[i].name);
        setTopSoldItems(temp);

        console.log(temp);

        setCountPlacedOrders(orders.length);

        let CompletedCount = 0, PendingCount = 0;
        for(let i = 0 ; orders[i] != undefined ; i++)
        {
            if(orders[i].status == "Completed")
                CompletedCount++;
            else if(orders[i].status != "Rejected")
                PendingCount++;
        }
        setCountCompletedOrders(CompletedCount);
        setCountPendingOrders(PendingCount);
    },[orders]);

    // console.log(window.st);
  
//   if (topSoldItems.length > 0 && countPlacedOrders > 0 && countPendingOrders > 0 && countCompletedOrders > 0)
//   {  
  return (
   
    <Grid container spacing={"center"}>
        <Grid item xs={12}>
        </Grid>
        <Grid item xs={12}>
            <h1 align="center">Statistics</h1>
        </Grid>
        <Grid item xs={3} align="center">
            <List style={{width:200}}>
                <ListSubheader style={{backgroundColor: "#E5E5E5", color: "#252525"}}>
                    Top five sold items
                </ListSubheader>
                {topSoldItems.map((item,i) => (
                    <ListItem style={{color: "#252525"}} disablePadding>
                        <ListItemText>
                            <Typography variant="body3" color="textSecondary">{(i+1) + ". " + item} </Typography>
                        </ListItemText>
                    </ListItem>
                ))}     
            </List>
        </Grid>
        <Grid item xs={3} align="center">
            <List style={{width:200}}>
                <ListSubheader style={{backgroundColor: "#E5E5E5", color: "#252525"}}>
                    Orders Placed
                </ListSubheader>
                <ListItem>
                    <ListItemText>
                        {countPlacedOrders} 
                    </ListItemText>
                </ListItem>
            </List>
        </Grid>
        <Grid item xs={3} align="center">
            <List style={{width:200}}>
                <ListSubheader style={{backgroundColor: "#E5E5E5", color: "#252525"}}>
                    Orders Pending
                </ListSubheader>
                <ListItem>
                    <ListItemText>
                        {countPendingOrders}
                    </ListItemText>
                </ListItem>
            </List>
        </Grid>
        <Grid item xs={3} align="center">
            <List style={{width:200}}>
                <ListSubheader style={{backgroundColor: "#E5E5E5", color: "#252525"}}>
                    Orders Completed
                </ListSubheader>
                <ListItem>
                    <ListItemText>
                        {countCompletedOrders}
                    </ListItemText>
                </ListItem>
            </List>
        </Grid>
    </Grid>
  );
}
// }