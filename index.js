//packages
const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const bookingmodel = require("./database/booking.js");

//express
const app = express();
dotenv.config();

//express configurations
app.use(express.static("public"));
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

//connection
mongoose
  .connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(process.env.PORT, () => {
      console.log(`Listening at ${process.env.PORT}`);
    })
  )
  .catch((error) => {
    console.log(error);
  });

//routes
const router = express.Router();
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/templates/home.html");
});

//showing booking entries
var cardhtml = fs.readFileSync(
  path.join(__dirname, "/templates/card.html"),
  "utf-8"
);
var show = fs.readFileSync(
  path.join(__dirname, "/templates/show.html"),
  "utf-8"
);
const repl = (card, element) => {
  let newcard = card.replace(/{%cid%}/g, element.cid);
  newcard = newcard.replace(/{%bid%}/g, element.bid);
  newcard = newcard.replace(/{%lid%}/g, element.lid);
  newcard = newcard.replace(/{%dsid%}/g, element.dsid);
  newcard = newcard.replace(/{%email%}/g, element.email);
  newcard = newcard.replace(/{%phone%}/g, element.phone);
  newcard = newcard.replace(/{%cname%}/g, element.cname);
  newcard = newcard.replace(/{%cat%}/g, element.createdAt);
  newcard = newcard.replace(/{%pid%}/g, element._id);

  return newcard;
};
app.get("/show", async (req, res) => {
  var bdata = {};
  var cardata = "";
  try {
    let bookings = await bookingmodel.find();
    bdata = bookings;
    bdata.forEach((element) => {
      cardata += repl(cardhtml, element);
    });

    const htmldata = show.replace(/{%bookingdata%}/g, cardata);
    res.send(htmldata);
  } catch (error) {
    console.log(error);
  }
});

app.get("/book", (req, res) => {
  res.sendFile(__dirname + "/templates/book.html");
});

//create a booking entry
app.post("/book", async (req, res) => {
  const data = new bookingmodel(req.body);
  try {
    await data.save();
    res.sendFile(__dirname + "/templates/book.html");
  } catch (error) {
    res.send(error);
  }
});

//delete a booking entry
app.get("/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await bookingmodel.findByIdAndDelete(id);
    res.sendFile(__dirname + "/templates/home.html");
  } catch (error) {
    console.log(error);
  }
});

//updating booking entry
app.post("/update/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const booking = await bookingmodel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
  } catch (error) {
    console.log(error);
  }
});
