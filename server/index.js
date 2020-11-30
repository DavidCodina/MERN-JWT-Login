require("dotenv").config(); //On start up this will read our .env file.
const express    = require("express");
const bodyparser = require("body-parser");
const mongoose   = require("mongoose");
const cors       = require("cors");
const api        = require("./routes");
const app        = express();


/* =============================================================================
                             Database Set Up
============================================================================= */


mongoose
  .connect(process.env.MONGO_DB_CONNECTION_STRING, {
    useNewUrlParser:    true,
    useUnifiedTopology: true,
    useCreateIndex:     true
  }
);


mongoose.connection.on('connected', () => {
  console.log('Connected to mongo instance!');
});


mongoose.connection.on('error', err => {
  console.error('Error connecting to mongo :(', err);
});


/* =============================================================================
                              Middleware
============================================================================= */


app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(cors());


/* =============================================================================
                        Routes (also middleware)
============================================================================= */



app.get("/", (req, res) => {
  return res.status(200).send("ok");
});

app.use("/api", api);


/* =============================================================================

============================================================================= */


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`The server has started on port: ${PORT}`));
