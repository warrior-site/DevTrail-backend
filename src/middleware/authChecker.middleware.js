import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const checkAuthMiddle = (req, res, next) => {
  const token = req.cookies?.token; // <-- use "token" since you set res.cookie("token", ...)
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Forbidden" });
    req.user = user;
    next();
  });
};
