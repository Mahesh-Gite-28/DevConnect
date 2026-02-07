require("dotenv").config();

express = require("express");

const cors = require("cors");

const cookieParser = require("cookie-parser");

const { connectDB } = require("./config/database");

const paymentWebhookHandler = require("./routes/paymentWebhookHandler");

const initiallizeSocket = require("./utils/socket");

const http = require("http");

app = express(); 

app.use(
  cors({
    origin: process.env.FRONTEND_URL, //frontend link
    credentials: true,
  }),
);

app.post(
  "/payment/webhook",
  express.raw({ type: "application/json" }),
  paymentWebhookHandler,
);

app.use(cookieParser()); //helps to read the cookie

app.use(express.json()); //inbuild middleware of express to read data in the body

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");
const chatRouter=require("./routes/chat");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);
app.use("/",chatRouter);

const server = http.createServer(app);

initiallizeSocket(server);

connectDB()
  .then(() => {
    console.log("Database connection estabilished....");
    server.listen(process.env.PORT, () => {
      console.log(
        "server is listening on port " + process.env.PORT + "........",
      );
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected");
  });
