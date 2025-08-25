import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../config/env.config.js";

export const setCookie = (res, user) => {
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });
   res.cookie('token', token, {
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'strict', // Helps prevent CSRF attacks
        maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expires in 7 days
    });


}