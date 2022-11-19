var express = require("express");
var router = express.Router();

// Load User model
const Vendor = require("../models/Vendors");

// GET request 
// Getting all the users
router.get("/", function(req, res) {
    Vendor.find(function(err, vendors) {
		if (err) {
			console.log(err);
		} else {
			res.json(vendors);
		}
	})
});

// NOTE: Below functions are just sample to show you API endpoints working, for the assignment you may need to edit them

// POST request 
// Add a user to db
router.post("/register", (req, res) => {
    const newVendor = new Vendor({
        managerName: req.body.managerName,
        shopName: req.body.shopName,
        email: req.body.email,
        contact: req.body.contact,
        openTime: req.body.openTime,
        closeTime: req.body.closeTime,
        password: req.body.password
    });

    newVendor.save()
        .then(vendor => {
            res.status(200).json(vendor);
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
	Vendor.findOne({ email }).then(vendor => {
		// Check if user email exists
		if (!vendor) {
			return res.status(404).json({
				error: "Email not found",
			});
        }
        else if (req.body.password != vendor.password) {

            return res.status(401).json({
				error: "Incorrect password",
			});
        }
        else {
            return res.status(200).json(vendor);
        }
	});
});

router.post("/edit", (req,res) => {
    const email = req.body.oldEmail;

    Vendor.findOne({ email }).then(vendor => {
        vendor.managerName = req.body.managerName;
        vendor.shopName = req.body.shopName;
        vendor.email = req.body.email;
        vendor.contact = req.body.contact;
        vendor.openTime = req.body.openTime;
        vendor.closeTime = req.body.closeTime;
        vendor.save();
        return res.status(200).json({
            message: "Successfully updated profile"
        });
    });
});

router.post("/editPasswd", (req,res) => {
    const email = req.body.email;

    Vendor.findOne({ email }).then(vendor => {
        if (vendor.password == req.body.password)
        {
            vendor.password = req.body.newPasswd;
            vendor.save();
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

router.post("/getTimings", (req,res) => { 
    const canteen = req.body.canteen

    Vendor.findOne({ shopName: canteen }).then(vendor => {
        let now = new Date();
        let hrs = now.getHours();
        
        let openTime = vendor.openTime.split(':');
        let closeTime = vendor.closeTime.split(':');

        return res.status(200).json({
            openTime: openTime,
            closeTime: closeTime
        })

        // res.send(openTime);
        // res.send(hrs);

        // if(Number(closeTime[0]) < Number(openTime[0]))
        //     if(now.getHours() >= Number(openTime[0]))
        //         if(now.getMinutes() >= Number(openTime[1]) && now.getMinutes() <= Number(closeTime[1]))
        //             return res.status(200).send(true);
        //     else if(now.getHours <= Number(closeTime[0]))
        //         if(now.getMinutes() >= Number(openTime[1]) && now.getMinutes() <= Number(closeTime[1]))
        //             return res.status(200).send(true);
        // else if(now.getHours() >= Number(openTime[0]) && now.getHours() <= Number(closeTime[0]))
        // {
        //     res.send("hi");
        //     if(now.getMinutes() >= Number(openTime[1]) && now.getMinutes() <= Number(closeTime[1]))
        //         return res.status(200).send(true);
        // }

        // return res.status(200).send(false);
    })
})

module.exports = router;