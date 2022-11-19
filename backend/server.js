const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = 4000;
const DB_NAME = "food-ordering-portal"

// routes
var testAPIRouter = require("./routes/testAPI");
var BuyerRouter = require("./routes/Buyers");
var VendorRouter = require("./routes/Vendors");
var FoodItemRouter = require("./routes/FoodItems");
var OrderRouter = require("./routes/Orders");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connection to MongoDB
mongoose.connect('mongodb://db:27017/' + DB_NAME, { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once('open', function() {
    console.log("MongoDB database connection established successfully !");
})

// setup API endpoints
app.use("/testAPI", testAPIRouter);
app.use("/buyer", BuyerRouter);
app.use("/vendor", VendorRouter);
app.use("/fooditem", FoodItemRouter);
app.use("/order", OrderRouter);

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});
