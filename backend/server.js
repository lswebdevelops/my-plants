import path from "path";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import bookRoutes from "./routes/bookRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

import blogRoutes from "./routes/blogRoutes.js";
import poemRoutes from "./routes/poemRoutes.js";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const port = process.env.PORT || 5000;

connectDB(); // connect to MongoDB

const app = express();
// body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// cookie parser middleware
app.use(cookieParser());

app.use("/api/books", bookRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/poems", poemRoutes);
app.use("/api/blogs", blogRoutes);

app.get("/api/config/paypal", (req, res) =>
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);

const __dirname = path.resolve(); // set __dirname to current directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// uncomment for production build
// change env> NODE_ENV > to production
// then add this script to the root package.json (   "build": "npm install && npm install --prefix frontend && npm run build --prefix frontend") and to .env :> NODE_ENV=development change to production

// if (process.env.NODE_ENV === 'production') {
//   //  set static folder
//   app.use(express.static(path.join(__dirname, '/frontend/build')));

//   // any route that is not api will be redirected to index.html
//   app.get('*', (req, res) =>
//   res.sendFile(path.resolve(__dirname, 'frontend', 'build' , 'index.html')))
// } else {
//   app.get("/", (req, res) => {
//     res.send("API is running...");
//   });
// }
// comment until here

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server is running on port ${port}`));
