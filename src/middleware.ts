import jwt from "jsonwebtoken";
import { jwtSecret } from "./constants";

export function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, jwtSecret, (err: any, userId: any) => {
    console.log(err);
    if (err) return res.sendStatus(403);
    req.userId = userId;
    next();
  });
}
