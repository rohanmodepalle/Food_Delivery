var express = require("express");
var router = express.Router();

// Load User model
const Order = require("../models/Orders");

// GET request 
// Getting all the users
router.get("/", function(req, res) {
    Order.find(function(err, orders) {
		if (err) {
			console.log(err);
		} else {
			res.json(orders);
		}
	})
});

router.post("/", (req, res) => {
    const canteen = req.body.canteen;
    
    Order.find({ canteen }).then(orders => {
        res.status(200).json(orders);
    })
})

router.post("/search", (req, res) => {
    const buyeremail = req.body.email;
    
    Order.find({ buyeremail }).then(orders => {
        res.status(200).json(orders);
    })
})

// POST request 
// Add a ORDER to db
router.post("/place", (req, res) => {
    const newOrder = new Order({
		buyeremail: req.body.buyeremail,
        fooditem: req.body.fooditem,
        addons: req.body.addons,
        price: req.body.price,
        canteen: req.body.canteen,
        quantity: req.body.quantity,
        time: req.body.time,
		status: req.body.status,
    });

    newOrder.save()
        .then(order => {
            res.status(200).json(order);
        })
        .catch(err => {
            res.status(400).send(err);
        });
});

router.post("/stage", (req, res) => {
	const email = req.body.buyeremail;
	const time = req.body.time;
	// Find user by email
	Order.findOne({ buyeremail: email, time: time }).then(order => {
        order.status = req.body.status;
        order.save();
        return res.status(200).json(order);
	})
	.catch(error => {
		return res.send("error");
	});
});

router.post("/delete", (req,res) => {
    const buyeremail = req.body.buyeremail;
    const time = req.body.time;

    Order.findOneAndDelete({ buyeremail, time }, function(err, docs){
        return res.status(200).json({
            message: "Successfully deleted"
        })
    });
});

router.post("/update", (req,res) => {
    const email = req.body.buyeremail;
	const time = req.body.time;
	
	Order.findOne({ buyeremail: email, time: time }).then(order => {
        order.isRated = true;
        order.save();
        return res.status(200).json(order);
	})
	.catch(error => {
		return res.send("error");
	});
});

module.exports = router;
