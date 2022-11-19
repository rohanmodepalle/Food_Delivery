import { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Paper, Grid, TableCell, TableHead, TableRow, Table, TableBody, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Autocomplete, Chip, Stack, Checkbox } from "@mui/material";
import Fuse from "fuse.js";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorderOutlined';

const BuyerDashboard = (props) => {
  
  const [addons, setAddons] = useState([]);
  const [OpenViewAddons, setOpenViewAddons] = useState(false);

  const [name, setName] = useState("");
  const [canteen, setCanteen] = useState("");
  const [price, setPrice] = useState(null);

  const [search, setSearch] = useState("");
  const [listeditems, setListedFoodItems] = useState([]);
  const [alltags, setAllTags] = useState([]);
  const [curtag, setCurTag] = useState(null);
  const [allcanteens, setAllCanteens] = useState([]);
  const [curcanteen, setCurCanteen] = useState(null);
  const [minprice, setMinPrice] = useState("");
  const [maxprice, setMaxPrice] = useState("");
  const [curtype, setCurType] = useState(null);

  const [isSortPrice, setIsSortPrice] = useState(true);
  const [isSortRating, setIsSortRating] = useState(true);
  
  const [favs, setFavs] = useState([]);
  const [Flag, setFlag] = useState(false);

  const [walletBalance, setWalletBalance] = useState(0);
  const [addMoneyState, setAddMoneyState] = useState(false);
  const [amount, setAmount] = useState(null);

  const [isBuy, setIsBuy] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState([]);

  const [isAvailable, setIsAvailable] = useState([]);

  const [error, setError] = useState(0);

  useEffect(() => {
    
    axios 
      .get("/api/fooditem")
      .then((response) => {
        let items = response.data;

        // Get all canteens
        let Canteens = [];
        for (let i = 0 ; items[i] != undefined ; i++)
        {
            let flag = false;
            for(let k = 0 ; Canteens[k] != undefined ; k++)
                if(Canteens[k] == items[i].canteen)
                {
                    flag = true;
                    break;
                }
            
            if(!flag)
                Canteens.push(items[i].canteen);
        }

        setAllCanteens(Canteens); 

        // Get all tags
        let Tags = [];
        for (let i = 0 ; items[i] != undefined ; i++)
            for (let j = 0 ; items[i].tags[j] != undefined ; j++)
            {
                let flag = false;
                for(let k = 0 ; Tags[k] != undefined ; k++)
                    if(Tags[k] == items[i].tags[j])
                    {
                        flag = true;
                        break;
                    }

                if(!flag)
                    Tags.push(items[i].tags[j]);
            }
        setAllTags(Tags); 

        // Load Wallet Balance
        const Buyer = {
            email: JSON.parse(localStorage.getItem("user")).email
        }
        axios.post("/api/buyer/getWallet",Buyer).then((res) => {
            setWalletBalance(res.data.balance);
        })

        let closedCanteens = [];
        axios.get("/api/vendor").then((response) => {
            let Vendors = response.data;

            for(let i = 0 ; Vendors[i] != undefined ; i++)
            {
                let now = new Date();
                let openTime = Vendors[i].openTime.split(':');
                let closeTime = Vendors[i].closeTime.split(':');

                let isOpen = false;

                if(Number(closeTime[0]) < Number(openTime[0]) || (Number(closeTime[0]) == Number(openTime[0]) && Number(closeTime[1]) <= Number(openTime[1])))
                {
                    if(now.getHours() > Number(openTime[0]) || now.getHours() < Number(closeTime[0]))
                        isOpen = true;
                }
                else if(now.getHours() > Number(openTime[0]) && now.getHours() < Number(closeTime[0]))
                {
                    isOpen = true;
                }
                
                if(now.getHours() == Number(openTime[0]))
                {
                    if(now.getMinutes() >= Number(openTime[1]))
                        isOpen = true;
                }

                if(now.getHours() == Number(closeTime[0]))
                {
                    if(now.getMinutes() <= Number(closeTime[1]))
                        isOpen = true;
                }

                if(!isOpen)
                    closedCanteens.push(Vendors[i].shopName);

                let isAvailableTemp = [];
                for(let i = 0 ; items[i] != undefined ; i++)
                {
                    let flag = false;
                    for(let j = 0 ; closedCanteens[j] != undefined ; j++)
                    {
                        if(items[i].canteen == closedCanteens[j])
                        {
                            isAvailableTemp.push(false);
                            items[i].isAvailable = false;
                            flag = true;
                            break;
                        }
                    }

                    if(!flag)
                    {
                        items[i].isAvailable = true;
                        isAvailableTemp.push(true);
                    }
                }
                setIsAvailable(isAvailableTemp);

                let List = []

                //Get favourites
                let Favs = JSON.parse(localStorage.getItem("user")).favs 
                setFavs(Favs);

                // Add favorite field
                for (let i = 0 ; items[i] != undefined ; i++)
                {
                    items[i].isFav = false;
                    for(let j = 0 ; Favs[j] != undefined ; j++)
                        if(items[i].name == Favs[j].name && items[i].canteen == Favs[j].canteen)
                        {
                            items[i].isFav = true;
                            break;
                        }
                }

                // Search
                if(search == "")
                    List = items;
                else
                {
                    const fuzzy = new Fuse(items, {
                        keys: ["name"],
                        threshold: 0.5
                    })
            
                    fuzzy.search(search).map(fuzzyObject => {
                        List.push(fuzzyObject.item);
                    })
                }

                // Filter by canteen
                if(curcanteen != null)
                {
                    let CanteenItems = []
                    for(let i = 0 ; List[i] != undefined ; i++)
                        if(curcanteen == List[i].canteen)
                            CanteenItems.push(List[i]);
                            
                    List = CanteenItems;
                }

                // Filter by type
                if(curtype != null)
                {
                    let TypeItems = []
                    for(let i = 0 ; List[i] != undefined ; i++)
                        if(curtype == List[i].type)
                            TypeItems.push(List[i]);
                            
                    List = TypeItems;
                }

                // Filter by tag
                if(curtag != null)
                {
                    let TaggedItems = []
                    for(let i = 0 ; List[i] != undefined ; i++)
                    {
                        for(let j = 0 ; List[i].tags[j] != undefined ; j++)
                            if(curtag == List[i].tags[j])
                            {
                                TaggedItems.push(List[i]);
                                break;
                            }
                    }
                    List = TaggedItems;
                }

                // Set min price
                if(minprice != "")
                {
                    let MinItems = []
                    for(let i = 0 ; List[i] != undefined ; i++)
                        if(List[i].price >= Number(minprice))
                            MinItems.push(List[i]);
                    List = MinItems;
                }

                // Set min price
                if(maxprice != "")
                {
                    let MaxItems = []
                    for(let i = 0 ; List[i] != undefined ; i++)
                        if(List[i].price <= Number(maxprice))
                            MaxItems.push(List[i]);
                    List = MaxItems;
                }

                let Temp = [];
                for(let i = 0 ; List[i] != undefined ; i++)
                {
                    if(List[i].isAvailable)
                    {
                        Temp.push(List[i]);
                    }
                }
     
                for(let i = 0 ; List[i] != undefined ; i++)
                {
                    if(!List[i].isAvailable)
                    {
                        Temp.push(List[i]);
                    }
                }
                List = Temp;
                setListedFoodItems(List);
            }
        })

      })
      .catch((error) => {
        console.log(error); 
      });
  }, [search, curtag, curcanteen, minprice, maxprice, curtype, Flag]);

  const sortPrice = () => {
    let TempList = listeditems;
    const flag = isSortPrice;
    TempList.sort((a, b) => {
      if(flag)
      {
        if(a.price <= b.price)
            return 1;
        else 
            return 0;
      }
      else
      {
        if(a.price >= b.price)
            return 1;
        else 
            return 0;
      }
      
    });
    setListedFoodItems(TempList)
    setIsSortPrice(!flag);
  };
  
  const sortRating = () => {
    let TempList = listeditems;
    const flag = isSortRating;
    TempList.sort((a, b) => {
      if(flag)
      {
        if(a.rating <= b.rating)
            return 1;
        else 
            return 0;
      }
      else
      {
        if(a.rating >= b.rating)
            return 1;
        else 
            return 0;
      }
      
    });
    setListedFoodItems(TempList)
    setIsSortRating(!flag);
  };

  const manageFavs = (ind) => {
    let flag = listeditems[ind].isFav;

    if(flag)
    {
        removeFromFavs(ind);
    }
    else
    {
        const User = {
            email: JSON.parse(localStorage.getItem("user")).email,
            item: listeditems[ind]
        }
        axios
            .post("/api/buyer/addToFav", User)
            .then((response) => {
                const user = JSON.parse(localStorage.getItem("user"));
                user.favs.push(listeditems[ind]);
                localStorage.setItem("user", JSON.stringify(user));
                setFlag(!Flag);
            })
    }
  }

  const updateBalance = () => {
    const User = {
        email: JSON.parse(localStorage.getItem("user")).email,
        amount: amount
    }
    axios
        .post("/api/buyer/addToWallet", User)
        .then((response) => {
            const user = JSON.parse(localStorage.getItem("user"));
            user.balance += amount;
            localStorage.setItem("user", JSON.stringify(user));
            setFlag(!Flag);
            setAmount(null);
            setAddMoneyState(false);
        })
  }

  const removeFromFavs = (ind) => {
    const User = {
        email: JSON.parse(localStorage.getItem("user")).email,
        item: listeditems[ind]
    };
    axios
        .post("/api/buyer/removeFromFav", User)
        .then((response) => {
            const user = JSON.parse(localStorage.getItem("user"));
            let index = 0;
            for(let i = 0 ; user.favs[i] != undefined ; i++)
                if(User.item.name == user.favs[i].name && User.item.canteen == user.favs[i].canteen)
                {
                    index = i
                    break;
                }
            user.favs.splice(index,1);
            localStorage.setItem("user", JSON.stringify(user));
            setFlag(!Flag);
        })
  }

  const buyItem = (item) => {
    setIsBuy(true);
    setName(item.name);
    setCanteen(item.canteen);
    setAddons(item.addons);
    setTotalPrice(item.price);
    setPrice(item.price);
  }

  const addAddon = (event,addon) => {
    if(event.target.checked)
    {
        setPrice(price + Number(addon.price));
        setTotalPrice(totalPrice + quantity*Number(addon.price));
        let temp = selectedAddons;
        temp.push(addon);
        setSelectedAddons(temp);
    }
    else
    {
        setPrice(price - Number(addon.price));
        setTotalPrice(totalPrice - quantity*Number(addon.price));
        let temp = selectedAddons;
        let index = 0;
        for(; temp[index] != undefined; index++)
            if(temp[index].name == addon.name && temp[index].price == addon.price)
                break;
        setSelectedAddons(temp.splice(index,1));
    }
  }

  const placeOrder = () => {
    if(totalPrice > walletBalance)
    {
        setError(200);
    }
    else
    {
        let now = new Date();
        const Order = {
            buyeremail: JSON.parse(localStorage.getItem("user")).email,
            fooditem: name,
            addons: selectedAddons,
            price: totalPrice,
            canteen: canteen,
            quantity: quantity,
            time: now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds(),
            status: "Placed"
        };

        const Wallet = {
            email: JSON.parse(localStorage.getItem("user")).email,
            balance: walletBalance - totalPrice
        }
        axios
            .post("/api/order/place", Order)
            .then((response) => {
                setIsBuy(false);
                setQuantity(1);
            })
        axios
            .post("/api/buyer/updateWallet", Wallet)
            .then((response) => {
                let user = JSON.parse(localStorage.getItem("user"));
                user.balance -= totalPrice;
                localStorage.setItem("user",JSON.stringify(user));
                setFlag(!Flag);
            })
        setError(0);
    }
  }

  const handleCloseBuy = () => {
    setError(0);
    setQuantity(1);
    setIsBuy(false);
  }

  const handleCloseViewAddons = () => {
    setOpenViewAddons(false);
  };

  const ViewAddons = (item) => {
    setAddons(item.addons);
    setOpenViewAddons(true);
  }

  return (
    <div>                                                                              
    <Grid container>
        <Grid item xs={12}>
            <h1 align="center">Menu</h1>
        </Grid>
    </Grid>
    <Grid container>
        <Grid item xs={4.41} sx={{marginBottom: 2}}>
            <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Search"
                type="email"
                fullWidth
                variant="outlined"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
            />
        </Grid>
        <Grid item xs={1.43} sx={{marginTop:1, marginLeft: 2}}>
            <Autocomplete
                options={allcanteens}
                onChange={(_, value) => setCurCanteen(value)}
                value={curcanteen}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Select Canteen"
                        variant="outlined"
                    />
                )}
            />
        </Grid>
        <Grid item xs={1.43} sx={{marginTop:1, marginLeft: 2}}>
            <Autocomplete
                options={["Veg","Non-Veg"]}
                onChange={(_, value) => setCurType(value)}
                value={curtype}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Select Type"
                        variant="outlined"
                    />
                )}
            />
        </Grid>
        <Grid item xs={1.43} sx={{marginTop:1, marginLeft: 2}}>
            <Autocomplete
                options={alltags}
                onChange={(_, value) => setCurTag(value)}
                value={curtag}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Select Tag"
                        variant="outlined"
                    />
                )}
            />
        </Grid>
        <Grid item xs={1.4} sx={{marginBottom: 2, marginLeft: 2}}>
            <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Min Price"
                type="email"
                fullWidth
                variant="outlined"
                value={minprice}
                onChange={(event) => setMinPrice(event.target.value)}
            />
        </Grid>
        <Grid item xs={1.4} sx={{marginBottom: 2, marginLeft: 1}}>
            <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Max Price"
                type="email"
                fullWidth
                variant="outlined"
                value={maxprice}
                onChange={(event) => setMaxPrice(event.target.value)}
            />
        </Grid>
    </Grid>
    <Grid container>
        <Grid item xs={9}>
          <Paper>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="center" width={50} style={{fontWeight:"bold"}}>Sr No</TableCell>
                  <TableCell align="center" style={{fontWeight:"bold"}}>Name</TableCell>
                  <TableCell align="center" style={{fontWeight:"bold"}}>Canteen</TableCell>
                  <TableCell align="center" style={{fontWeight:"bold"}}>Type</TableCell>
                  <TableCell align="center" style={{fontWeight:"bold"}}>         
                    <Grid container xs={12}>
                        <Grid item xs={11.75} sx={{marginTop:1}}>
                            Price
                        </Grid>
                        <Grid item xs={0.25}>
                            <Button onClick={sortPrice}>
                            {isSortPrice ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
                            </Button> 
                        </Grid>
                    </Grid>   
                  </TableCell>
                  <TableCell align="center" style={{fontWeight:"bold"}}>
                  <Grid container xs={12}>
                        <Grid item xs={11.75} sx={{marginTop:1}}>
                            Rating
                        </Grid>
                        <Grid item xs={0.25}>
                            <Button onClick={sortRating}>
                            {isSortRating ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
                            </Button> 
                        </Grid>
                    </Grid>
                  </TableCell>
                  <TableCell align="center" width={100} style={{fontWeight:"bold"}}>Tags</TableCell>
                  <TableCell align="center" style={{fontWeight:"bold"}}>Add-ons</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {listeditems.map((item, ind) => (
                  <TableRow key={ind}>
                    <TableCell align="center">{ind + 1}</TableCell>
                    <TableCell align="center">{item.name}</TableCell>
                    <TableCell align="center">{item.canteen}</TableCell>
                    <TableCell align="center">{item.type}</TableCell>
                    <TableCell align="center">Rs. {item.price}</TableCell>
                    <TableCell align="center">{item.rating == 0 ? item.rating : item.rating.toPrecision(2)}</TableCell>
                    <TableCell align="center">
                        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" style={{ marginLeft:20, marginRight:20}}>
                            {item.tags.map((tag,i) => (
                                <Chip label={tag} style={{marginLeft: 5}}></Chip>
                            ))}
                        </Stack>
                    </TableCell>
                    <TableCell align="center">
                        <Button variant="contained" style={{backgroundColor: "blue"}} onClick={() => ViewAddons(item)}>
                            View
                        </Button>
                    </TableCell>
                    <TableCell>
                        {item.isAvailable ?
                        <Button variant="contained" style={{backgroundColor: "yellowgreen"}} onClick={() => buyItem(item)}>
                            Buy
                        </Button>
                        :
                        <Typography align="center" color={"red"} fontWeight={"bold"}>NA</Typography>
                        }
                    </TableCell>
                    <TableCell>
                        <Button onClick={() => manageFavs(ind)}>
                            {!item.isFav ? <FavoriteBorderIcon sx={{color:"red"}} /> : <FavoriteIcon sx={{color:"red"}} />}
                        </Button> 
                    </TableCell>
                    <Dialog open={isBuy} onClose={handleCloseBuy} fullWidth maxWidth="md">
                        <DialogTitle style={{height: 5}}><Typography fontSize={20} fontWeight={"bold"}>Buy item</Typography></DialogTitle>
                        <DialogContent>
                        <Grid container xs={12}>
                            <Grid xs={4}>
                            <TextField 
                            autoFocus
                            margin="dense"
                            label={"Name"}
                            fullWidth
                            variant="outlined"
                            value={name}
                            style={{marginTop: 30}}
                            />
                            </Grid>
                            <Grid xs={4}>
                            <TextField 
                            autoFocus
                            margin="dense"
                            label={"Price"}
                            fullWidth
                            variant="outlined"
                            value={"Rs. " + price}
                            style={{marginTop: 30, marginLeft: 10}}
                            />
                            </Grid>
                            <Grid xs={4}>
                            <TextField
                            id="filled-number"
                            label="Quantity"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            InputProps={{ inputProps: { min: 1} }}
                            variant="outlined"
                            value={quantity}
                            style={{marginTop: 30, marginLeft: 20}}
                            onChange={(event) => {setQuantity(event.target.value); setTotalPrice(event.target.value*price)}}
                            />
                            </Grid>       
                        </Grid> 
                        <Grid item xs={12} sx={{marginTop:2}}>
                            <Typography fontSize={20} fontWeight={"bold"}>Select Add-ons</Typography>
                        </Grid>
                        {addons.map((addon, i) => (
                        <Grid container>
                            <Grid container>
                                <Grid item xs = {12} style={{height: 50}}>
                                <h5>Add-on {i+1}</h5>
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={5}>
                                <TextField 
                                autoFocus
                                margin="dense"
                                label={"Name"}
                                fullWidth
                                variant="outlined"
                                value={addons[i].name}
                                /> 
                                </Grid>
                                <Grid item xs={5} sx={{marginLeft:2}}>
                                <TextField 
                                autoFocus
                                margin="dense"
                                label={"Price (in Rs)"}
                                fullWidth
                                variant="outlined"
                                value={addons[i].price}
                                /> 
                                </Grid>
                                <Grid item xs={1} sx={{marginLeft:2, marginTop: 2}}>
                                <Checkbox aria-label="controlled" onChange={(event) => addAddon(event,addon)} />
                                </Grid>   
                            </Grid>                          
                        </Grid>
                        ))} 
                        <Grid container>
                                <Grid item xs={4}></Grid>
                                <Grid item xs={4}>
                                <TextField 
                                autoFocus
                                margin="dense"
                                label={"Total Price"}
                                fullWidth
                                variant="outlined"
                                value={"Rs. " + totalPrice}
                                style={{marginTop: 30}}
                                />
                            </Grid> 
                            <Grid item xs={4}></Grid>
                        </Grid> 
                        {error == 200 && (
                            <Grid item xs={12}>
                                <Typography color={"error"} ali>Insufficient balance in wallet</Typography>
                            </Grid>
                        )}
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={handleCloseBuy}>Cancel</Button>
                        <Button onClick={placeOrder}>Place Order</Button>
                        </DialogActions>
                    </Dialog>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
        <Grid item xs={3}>
            <Grid container xs={12}>
                <Grid item xs={12}>
                    <h1 align="center">Wallet</h1>
                </Grid>
                <Grid item xs={6}>
                    <Typography sx={{marginLeft:2}}>Balance : </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography sx={{marginRight:2, textAlign:"right"}}>Rs. {walletBalance}</Typography>
                </Grid>
                {addMoneyState && (
                    <Grid container xs={12}>
                        <Grid item xs={2}></Grid>
                        <Grid item xs={8}>
                        <TextField 
                            autoFocus
                            margin="dense"
                            label={"Enter Amount (in Rs)"}
                            type="number"
                            InputProps={{ inputProps: { min: 0 } }}
                            fullWidth
                            variant="outlined"
                            value={amount}
                            style={{marginBottom:10}}
                            onChange={(event) => {setAmount(Number(event.target.value));}}
                            /> 
                        </Grid>
                    </Grid>    
                )}
                <Grid item xs={4}></Grid>
                <Grid item xs={4} sx={{alignItems: "center"}}>
                    {addMoneyState ? (<Button variant="contained" style={{backgroundColor: "blue", marginLeft:35}} onClick={updateBalance}>Submit</Button>) : (<Button variant="contained" style={{backgroundColor: "blue", marginLeft:20}} onClick={() => {setAddMoneyState(true);}}>
                        Add Money
                    </Button>)}
                </Grid>
            </Grid>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={9}>
            <h1 align="center">Favorites</h1>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={9}>
          <Paper>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="center" width={50} style={{fontWeight:"bold"}}>Sr No</TableCell>
                  <TableCell align="center" style={{fontWeight:"bold"}}>Name</TableCell>
                  <TableCell align="center" style={{fontWeight:"bold"}}>Canteen</TableCell>
                  <TableCell align="center" style={{fontWeight:"bold"}}>Type</TableCell>
                  <TableCell align="center" style={{fontWeight:"bold"}}>Price</TableCell>
                  <TableCell align="center" style={{fontWeight:"bold"}}>Rating</TableCell>
                  <TableCell align="center" width={100} style={{fontWeight:"bold"}}>Tags</TableCell>
                  <TableCell align="center" style={{fontWeight:"bold"}}>Add-ons</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {favs.map((item, ind) => (
                  <TableRow key={ind}>
                    <TableCell align="center">{ind + 1}</TableCell>
                    <TableCell align="center">{item.name}</TableCell>
                    <TableCell align="center">{item.canteen}</TableCell>
                    <TableCell align="center">{item.type}</TableCell>
                    <TableCell align="center">Rs. {item.price}</TableCell>
                    <TableCell align="center">{item.rating == 0 ? item.rating : item.rating.toPrecision(2)}</TableCell>
                    <TableCell align="center">
                        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" style={{ marginLeft:20, marginRight:20}}>
                            {item.tags.map((tag,i) => (
                                <Chip label={tag} style={{marginLeft: 5}}></Chip>
                            ))}
                        </Stack>
                    </TableCell>
                    <TableCell align="center">
                        <Button variant="contained" style={{backgroundColor: "blue"}} onClick={() => ViewAddons(item)}>
                            View
                        </Button>
                    </TableCell>
                    <TableCell>
                        <Button variant="contained" color="error" onClick={() => removeFromFavs(ind)}>
                            Remove
                        </Button>
                    </TableCell>
                    <Dialog open={OpenViewAddons} onClose={handleCloseViewAddons}>
                        <DialogTitle style={{height: 5}}>Add-ons</DialogTitle>
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
                        <Button onClick={handleCloseViewAddons}>OK</Button>
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

export default BuyerDashboard;
