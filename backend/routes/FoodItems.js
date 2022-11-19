var express = require("express");
var router = express.Router();

const FoodItem = require("../models/FoodItems");
const Order = require("../models/Orders")

// GET request 
// Getting all the users
router.get("/", function(req, res) {
    FoodItem.find(function(err, fooditems) {
		if (err) {
			console.log(err);
		} else {
			res.json(fooditems);
		}
	})
});

router.post("/", function(req, res) {
    const canteen = req.body.canteen;
    
    FoodItem.find({ canteen }).then(fooditems => {
        res.status(200).json(fooditems);
    })
});

router.post("/additem", (req, res) => {
    const newFoodItem = new FoodItem({
        name: req.body.name,
        canteen: req.body.canteen,
        price: req.body.price,
        rating: req.body.rating,
        type: req.body.type,
        tags: req.body.tags,
        addons: req.body.addons
    });

    newFoodItem.save()
        .then(fooditem => {
            res.status(200).json(fooditem);
        })
        .catch(err => {
            res.status(400).send(err);
        });
});

router.post("/updateitem", (req,res) => {
    const name = req.body.oldname;
    const canteen = req.body.canteen;

    FoodItem.findOne({ name, canteen }).then(fooditem => {
        fooditem.name = req.body.name;
        fooditem.type = req.body.type;
        fooditem.price = req.body.price;
        fooditem.save();
        return res.status(200).json({
            message: "Successfully updated food item"    
        })
    })
    .catch(err => {
        res.status(400).send(err);
    });
});

router.post("/deleteitem", (req,res) => {
    const name = req.body.name;
    const canteen = req.body.canteen;

    FoodItem.findOneAndDelete({ name, canteen }, function(err, docs){
        return res.status(200).json({
            message: "Successfully deleted"
        })
    });
});

router.post("/updatetags", (req,res) => {
    const name = req.body.name;
    const canteen = req.body.canteen;

    FoodItem.findOne({ name, canteen }).then(fooditem => {
        fooditem.tags = req.body.tags;
        fooditem.save();
        return res.status(200).json({
            message: "Successfully updated tags"    
        })
    })
    .catch(err => {
        res.status(400).send(err);
    });
});

router.post("/updateaddons", (req,res) => {
    const name = req.body.name;
    const canteen = req.body.canteen;

    FoodItem.findOne({ name, canteen }).then(fooditem => {
        fooditem.addons = req.body.addons;
        fooditem.save();
        return res.status(200).json({
            message: "Successfully updated addons"    
        })
    })
    .catch(err => {
        res.status(400).send(err);
    });
});

router.post("/getrating", (req,res) => {
    const name = req.body.name;
    const canteen = req.body.canteen;

    FoodItem.findOne({ name, canteen }).then(fooditem => {
        return res.status(200).send(fooditem);
    })
    .catch(err => {
        res.status(400).send(err);
    });
});

router.post("/updaterating", (req,res) => {
    const name = req.body.name;
    const canteen = req.body.canteen;
    const rating = req.body.rating;
    // const buyeremail = req.body.buyeremail;
    // const time = req.body.time;
    // let avgrating = 0;
    
    FoodItem.findOne({ name, canteen }).then(fooditem => {
        fooditem.rating = ((fooditem.rating * fooditem.orderCount) + rating) / (fooditem.orderCount + 1);
        fooditem.orderCount++;
        fooditem.save();
        return res.status(200).send(fooditem);
    })
    .catch(err => {
        res.status(400).send(err);
    });

    // Order.findOne({ buyeremail, time }).then(order => {
    //     // order.rating = avgrating;
    //     order.save();
    //     return res.status(200).send(order);
    // })
    // .catch(err => {
    //     res.status(400).send(err);
    // });
});

module.exports = router;