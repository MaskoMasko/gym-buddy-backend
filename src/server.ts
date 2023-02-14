import bodyParser from "body-parser";
import express from "express";
import authRouter from "./routes/auth";
import home from "./routes/home";
import chatRoom from "./routes/chatRoom";
import messages from "./routes/messages";
import gymLocations from "./routes/gymLocations";
import friends from "./routes/friends";

const app = express();
app.use(bodyParser.urlencoded());

app.use(bodyParser.json());
app.use("/", authRouter);
app.use("/", home);
app.use("/", chatRoom);
app.use("/", messages);
app.use("/", gymLocations);
app.use("/", friends);

app.listen(4000, () => {
  console.log(`Server running on http://localhost:4000`);
});
