const express = require("express");
const app = express();
const dotenv = require("dotenv");
const jobRoute = require("./routes/job");
const port = process.env.PORT || 3000;
const authRoute = require("./routes/auth");
const fs = require("fs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authMiddleware = require("./middleware/auth");
dotenv.config();

app.use(bodyParser.urlencoded({ extended: false }));
app.get("/", (req, res) => {
  res.send("hello world");
});

app.use((req, res, next) => {
  const reqString = `${req.method} ${req.url} ${Date.now()}/n`;
  fs.writeFile("log.txt", reqString, { flag: "a" }, (err) => {
    if (err) {
      console.log(err);
    }
  });

  next();
});

app.use("/v1/job", authMiddleware, jobRoute);
app.use("/v1/auth", authRoute);
app.use((err, req, res, next) => {
  const reqString = `${req.method} ${req.url} ${Date.now()} ${err.message} /n`;
  fs.writeFile("error.txt", reqString, { flag: "a" }, (err) => {
    if (err) {
      console.log(err);
    }
  });
  res.status(500).send("Internal server error ");
  next();
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  mongoose.connect(process.env.DB_CONNECT);
});
