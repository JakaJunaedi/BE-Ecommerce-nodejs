const express = require("express");
const env = require("dotenv");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const midtransClient = require("midtrans-client");
const port = process.env.PORT || 2000;

// ----- live chat socket.io
const { addUser, removeUser, getUser, getUserInRoom } = require('./controller/chats');
const http = require("http").createServer(app);
const socketIo = require("socket.io");
//const io = socketIo(http);
const io = socketIo(http, {
  cors: {
    origin: "*",
  },
});
var corsOptions = {
  origin: "*",
};

//routes
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin/auth");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const initialDataRoutes = require("./routes/admin/initialData");
const pageRoutes = require("./routes/admin/page");
const addressRoutes = require("./routes/address");
const orderRoutes = require("./routes/order");
const adminOrderRoute = require("./routes/admin/order.routes");
const wishlistRoute = require("./routes/wishlist");
const chatRoute = require("./routes/chats");

//environment variable or you can say constants
env.config();

// mongodb connection
//mongodb+srv://root:<password>@cluster0.8pl1w.mongodb.net/<dbname>?retryWrites=true&w=majority
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.itlae.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then(() => {
    console.log("Database connected");
  });

// -----live chat socket.io
io.on("connection", (socket) => {
  console.log("User connection !!!");
  socket.on("join", ({ email, room }, callback) => {
    console.log(email, room);
    const { error, user } = addUser({ id: socket.id, email, room });

    if(error) return callback(error);

    socket.emit('message', { user : 'admin', text: `${user.email}, welcome to chat ${user.room}` });
    socket.broadcast.to(user.room).emit('message', {user: 'admin', text: `${user.email}, has joined`})
    socket.join(user.room);
    callback();

    //const error = true;
    //if(error){
    //  callback({ error: 'error'});
    //}
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit('message', { user: user.email, text: message });
    callback();
  });

  socket.on("disconnect", () => {
    console.log("User log Off !!!");
  });
});

// Midtrans
let snap = new midtransClient.Snap({
  // Set to true if you want Production Environment (accept real transaction).
  isProduction: false,
  serverKey: "SB-Mid-server-cvjA8wUIptLcFIhTs5GRo8Sd",
});

let parameter = {
  transaction_details: {
    order_id: "YOUR-ORDERID-123456",
    gross_amount: 10000,
  },
  credit_card: {
    secure: true,
  },
  customer_details: {
    first_name: "budi",
    last_name: "pratama",
    email: "budi.pra@example.com",
    phone: "08111222333",
  },
};

snap.createTransaction(parameter).then((transaction) => {
  // transaction token
  let transactionToken = transaction.token;
  console.log("transactionToken:", transactionToken);
});

app.use(cors(corsOptions));
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "uploads")));
app.use("/api", authRoutes);
app.use("/api", adminRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes);
app.use("/api", initialDataRoutes);
app.use("/api", pageRoutes);
app.use("/api", addressRoutes);
app.use("/api", orderRoutes);
app.use("/api", adminOrderRoute);
app.use("/api", wishlistRoute);
app.use("/api", chatRoute);

http.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
