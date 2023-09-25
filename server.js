require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors"); // Import the cors package

const jwt = require("jsonwebtoken");
app.use(express.json());
app.use(cors()); // Enable CORS for all routes
const posts = [
	{
		username: "Ibrahim",
		title: "Post 1",
	},
	{
		username: "Tarik",
		title: "Post 2",
	},
];

app.get("/posts", authenticateToken, (req, res) => {
	res.json(posts.filter((post) => post.username === req.user.name));
});

app.post("/login", (req, res) => {
	// Authenticate user (you should have your own authentication logic here)
	const username = req.body.username;
	const user = { name: username };

	// Create a JWT token with the user data and your secret key from environment variables
	const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
	res.json({ accessToken: accessToken });
});

function authenticateToken(req, res, next) {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];
	if (token == null) return res.sendStatus(401);

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
		if (err) return res.sendStatus(403);
		req.user = user;
		next();
	});
}

app.get("/users", (req, res) => {
	res.json(posts);
});

app.listen(3000);
