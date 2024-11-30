const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require('cors');
const cookieparser = require('cookie-parser')
const { userRoutes, blogRoutes } = require("./src/routes");
const { errHandling } = require("./src/middlewares");

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieparser());

app.use("/api/", userRoutes);
app.use("/api/", blogRoutes);

app.use(errHandling);

// change HOST and PORT in .env
require('dotenv').config()
const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 3000

app.listen(port, host, () => {
  console.log(`Server started on ${host}:${port}`)
})