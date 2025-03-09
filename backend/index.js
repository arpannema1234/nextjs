import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"));

const UserSchema = new mongoose.Schema({
  email: String,
  passwordHash: String,
});

const PostSchema = new mongoose.Schema({
  title: String,
  content: String,
  authorId: mongoose.Schema.Types.ObjectId,
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", UserSchema);
const Post = mongoose.model("Post", PostSchema);

const SECRET_KEY = process.env.JWT_SECRET;

// Signup API
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({ email, passwordHash });
  await user.save();
  res.status(201).json({ message: "User registered successfully" });
});

// Login API
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !bcrypt.compare(password, user.passwordHash)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ token });
});

// Middleware for authentication
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    req.user = jwt.verify(token, SECRET_KEY);
    next();
  } catch {
    res.status(403).json({ message: "Invalid token" });
  }
};

// Post article API
app.post("/post", authenticate, async (req, res) => {
  const { title, content } = req.body;
  const post = new Post({ title, content, authorId: req.user.userId });
  await post.save();
  res.status(201).json({ message: "Post created successfully" });
});

// Get all posts
app.get("/posts", async (req, res) => {
  const { author } = req.query;
  const posts = author
    ? await Post.find({ authorId: author })
    : await Post.find();
  res.json(posts);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
