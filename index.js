import express from "express";
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";

import upload from "./upload.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());

// multer upload
app.post("/api/upload", upload.single("file"), (req, res) => {
	if (!req.file) {
		return res.status(400).json({ error: "No file uploaded" });
	}
	const file = req.file;
	res.status(200).json(file.filename);
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

// server port


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
	console.log(`API working on port ${PORT}!`);
});
