import bodyParser from "body-parser";
import cookieparser from "cookie-parser";
import express from "express";
import authRouter from "./routes/auth";
import chatRoom from "./routes/chatRoom";
import friends from "./routes/friends";
import gymLocations from "./routes/gymLocations";
import home from "./routes/home";
import messages from "./routes/messages";
import workouts from "./routes/workouts";
import blogs from "./routes/blogs";

const app = express();
app.use(bodyParser.urlencoded());
app.use(cookieparser());

app.use(bodyParser.json());
app.use("/images", express.static("images"));
app.use("/", authRouter);
app.use("/", home);
app.use("/", chatRoom);
app.use("/", messages);
app.use("/", gymLocations);
app.use("/", friends);
app.use("/", workouts);
app.use("/", blogs);

app.listen(4000, () => {
  console.log(`Server running on http://localhost:4000`);
});
