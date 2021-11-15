const router = require("express").Router();
const User = require("../models/user.models");
const address = require("../models/address.models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


//normalement login et register on les mets dans controller wahad'hon mais on les mis ici

router.post("/register", async (req, res) => {
  try {
    const existEmail = await User.findOne({ email: req.body.email });
    if (existEmail)
      return res.json({
        message: "Email exist",
      });

    const salt = await bcrypt.genSalt(16);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newAddress = new address({
      city: req.body.city,
      zipCode: req.body.zipCode,
      street: req.body.street,
      note: req.body.note,
    });
    const savedAddress = await newAddress.save();//on a sauvegarder l'adresse car elle est complexe comporte plusieurs champs,dans une const appart

    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,//l bd tekhou lhashed pw
      IDCard: req.body.IDCard,
      phoneNumber: req.body.phoneNumber,
      signature: req.body.signature,
      address: savedAddress._id,//on applle l'adresse sauvegardée par l id 
    });
    const savedUser = await newUser.save();
    return res.json(savedUser);
  } catch (err) {
    return res.json(err);
  }
});
router.post("/login", async (req, res) => {
  try {
    const userExist = await User.findOne({ email: req.body.email });
    if (!userExist) return res.json({ message: "Email/Password Wrong" });
    const validPassword = await bcrypt.compare(
      req.body.password,
      userExist.password//le pw deja existe dans la bd qui est crypté
    );
    if (!validPassword) return res.json({ message: "Email/Password Wrong" });
    const token = jwt.sign(//jwt.sing prend 3param 
      { _id: userExist._id, isActive: userExist.isActive },
      "ezifhaezdf74",
      { expiresIn: "2 days" }
    );
    return res.json({ token: token, user: userExist });
  } catch (err) {
    return res.json(err);
  }
});
module.exports = router;