var express = require("express");
var router = express.Router();

// Load User model
const Buyer = require("../models/Buyers");

// GET request 
// Getting all the users
router.get("/", function(req, res) {
    Buyer.find(function(err, buyers) {
		if (err) {
			console.log(err);
		} else {
			res.json(buyers);
		}
	})
});

// NOTE: Below functions are just sample to show you API endpoints working, for the assignment you may need to edit them

// POST request 
// Add a user to db
router.post("/register", (req, res) => {
    const newBuyer = new Buyer({
        name: req.body.name,
        email: req.body.email,
        contact: req.body.contact,
        age: req.body.age,
        batch: req.body.batch,
        password: req.body.password
    });

    newBuyer.save()
        .then(buyer => {
            res.status(200).json(buyer);
        })
        .catch(err => {
            res.status(400).send(err);
        });
});

// POST request 
// Login
router.post("/login", (req, res) => {
	const email = req.body.email;
	// Find user by email
	Buyer.findOne({ email }).then(buyer => {
		// Check if user email exists
		if (!buyer) {
			return res.status(404).json({
				error: "Email not found",
			});
        }
        else if (req.body.password != buyer.password) {

            return res.status(401).json({
				error: "Incorrect password",
			});
        }
        else {
            return res.status(200).json(buyer);
        }
	});
});

router.post("/edit", (req,res) => {
    const email = req.body.oldEmail;

    Buyer.findOne({ email }).then(buyer => {
        buyer.name = req.body.name;
        buyer.email = req.body.email;
        buyer.contact = req.body.contact;
        buyer.age = req.body.age;
        buyer.batch = req.body.batch;
        buyer.save();
        return res.status(200).json({
            message: "Successfully updated profile"
        });
    });
});

router.post("/editPasswd", (req,res) => {
    const email = req.body.email;

    Buyer.findOne({ email }).then(buyer => {
        if (buyer.password == req.body.password)
        {
            buyer.password = req.body.newPasswd;
            buyer.save();
            return res.status(200).json({
                message: "Successfully updated password"
            });
        }
        else
        {
            return res.status(401).json({
                error: "Incorrect password"
            });
        }
    });
});

router.post("/addToFav", (req,res) => {
    const email = req.body.email;
    const item = req.body.item;

    Buyer.findOne({ email }).then(buyer => {
        buyer.favs.push(item);
        buyer.save();
        return res.status(200).json({
            message: "Successfully added to favorites"
        });
    });
});

router.post("/removeFromFav", (req,res) => {
    const email = req.body.email;
    const item = req.body.item;

    Buyer.findOne({ email }).then(buyer => {
        let index = 0;
        for(let i = 0 ; buyer.favs[i] != undefined ; i++)
            if(item.name == buyer.favs[i].name && item.canteen == buyer.favs[i].canteen)
            {
                index = i
                break;
            }
        buyer.favs.splice(index,1);
        buyer.save();
        return res.status(200).json({
            message: "Successfully removed from favorites"
        });
    });
})

router.post("/addToWallet", (req,res) => {
    const email = req.body.email;
    const amount = req.body.amount;

    Buyer.findOne({ email }).then(buyer => {
        buyer.balance += amount;         
        buyer.save();
        return res.status(200).json({
            message: "Successfully added balance"
        });
    });
})

router.post("/getWallet", (req,res) => {
    const email = req.body.email;

    Buyer.findOne({ email }).then(buyer => {
        return res.status(200).json({
            balance: buyer.balance
        });
    });
})

router.post("/updateWallet", (req,res) => {
    const email = req.body.email;
    const balance = req.body.balance;

    Buyer.findOne({ email }).then(buyer => {
        buyer.balance = balance;         
        buyer.save();
        return res.status(200).json({
            message: "Successfully updated balance"
        });
    });
})

router.post("/refundWallet", (req,res) => {
    const email = req.body.email;
    const price = req.body.price;

    Buyer.findOne({ email }).then(buyer => {
        buyer.balance += Number(price);         
        buyer.save();
        return res.status(200).json({
            message: "Successfully refunded to balance"
        });
    });
})

module.exports = router;

