import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import connectDB from "./config/db.js";
import routes from "./routes/routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
dotenv.config();

connectDB();

// middleware
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, "client", "build")));
app.use(bodyParser.json());
app.use(routes);
// app.use('/some-route', require(path.join(__dirname, 'api', 'routes', 'route.js'));
const __dirname = path.resolve();

if (
  process.env.NODE_ENV === "production" ||
  process.env.NODE_ENV === "staging"
) {
  app.use(express.static(path.join(__dirname, "client", "build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/client/build/index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
