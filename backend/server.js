require("dotenv").config();
const express = require("express");
const port = process.env.PORT || 8000;
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const {notFound, errorHandler} = require("./middlewares/errorHandler");
const {db} = require("./config/db");
const cloudinary = require("cloudinary");

const app = express();

app.use(
    cors({
      origin: [process.env.PORTFOLIO_URL, process.env.DASHBOARD_URL],
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    })
);



app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(
    fileUpload({
      useTempFiles: true,
      tempFileDir: "/tmp/",
    })
);

app.use("/api/v1", require("./routers/index"));



app.use(notFound);
app.use(errorHandler);

cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

app.listen(port, (err)=>{
    if(err) {
        console.log(`Error in server: ${err}`);
        return;
    }
    console.log(`Server is running at port ${port}`);
    console.log("portfolio url is ", process.env.PORTFOLIO_URL);
    console.log("Dashborard url is ", process.env.DASHBOARD_URL);
});