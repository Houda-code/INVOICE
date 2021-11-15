const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
// DB connection
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
mongoose.connect("mongodb://localhost:27017/invoice-db");
mongoose.connection.on("connected", () => {
  console.log("DB connected");
});
mongoose.connection.on("error", (err) => {
  console.log("there is error in ", err);
});

//import route middlewares
const authRoutes = require("./routes/auth.routes");
const invoiceRoutes = require("./routes/invoice.routes");
//middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//routes middlewares
app.use("/auth", authRoutes);
app.use("/invoices", invoiceRoutes);
//server listening
const port = 8000;
app.listen(port, () => {
  console.log(`this server is running on port ${port}`);
});