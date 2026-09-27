import express from "express";
import cors from "cors";
import superAdminRouter from "./routes/superAdminRoutes.js";
import authRouter from "./routes/authRoutes.js";
import blogRouter from "./routes/blogRoutes.js";

const app = express();

app.use(express.json())
app.use(cors())

app.use("/admin", superAdminRouter)
app.use("/auth", authRouter)
app.use("/blog", blogRouter)



export default app;