require('dotenv').config()
const express = require("express");
const app = express();
const port = 3006;
const bodyParser = require("body-parser");
const router = require("./routes");
const cors = require("cors");
const paginate = require('express-paginate');

app.use(cors());
app.use(paginate.middleware(10, 50));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use("/api/v1", router);

app.listen(port, () => {
  console.log(`Tickitz Backend listening on port ${port}`);
});
