const express = require("express");
const dotenv = require("dotenv");
require("dotenv").config();

const schoolRoutes = require("./routes/schoolRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Routes

app.use("/api/school", schoolRoutes);

app.get('/', (req, res) => {
  res.send(' API is running!');
});
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
