//Packages import
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");

//Security pakages
const helmet = require("helmet"); //Headers Secure
const xss = require("xss-clean"); //CrossSite scripting attack secure
const mongoSanitize = require("express-mongo-sanitize"); //MongoDb secure

// const bodyParser = require('body-parser')  At first we used bodyparser but express contain default

//files import
const connectDB = require("./config/db.js");
const testRoutes = require("./routes/testRoutes.js");
const authRoutes = require("./routes/authRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const jobsRoutes = require("./routes/jobsRoutes.js");
const { errorMiddleware } = require("./middlewares/errorMiddleware.js");

dotenv.config();

connectDB();

const app = express();

app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/api/v1/test", testRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/job", jobsRoutes);

//Error Middleware
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.DEV_MODE} on ${PORT}`);
});
