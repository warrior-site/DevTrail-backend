import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../config/env.config.js";

export const setCookie = (res,user) =>{
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });
    res.cookie("token", token, { httpOnly: true });
}