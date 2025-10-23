import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
dotenv.config();

import individualAuth from "./routes/AuthIndividual.js";
import ngoAuth from "./routes/authNgo.js";
import hotelAuth from "./routes/authHotel.js";
import foodRoutes from "./routes/foodRoutes.js";
import hotelDashboardRoutes from "./routes/hotelDashboard.js";
import reportRoutes from "./routes/reportRoutes.js";
import HotelReportRoutes from "./routes/HotelReportRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";



const app = express();
const server=http.createServer(app);
export const io=new Server(server,{
  cors: { origin: "*" }, 
});
io.on("connection",(socket)=>{
  console.log("New client connected:",socket.id);

  socket.on("disconnect",()=>{
    console.log("Client disconnected:",socket.id);
  });
});
app.use(express.json());
app.use(cors());

app.use("/api/auth/individual", individualAuth);
app.use("/api/auth/ngo", ngoAuth);
app.use("/api/auth/hotel", hotelAuth);
app.use("/api/food",foodRoutes);
app.use("/api/hotel", hotelDashboardRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/hotelReports", HotelReportRoutes);
app.use("/api/admin", adminRoutes);
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error("MongoDB connection error:", err));
