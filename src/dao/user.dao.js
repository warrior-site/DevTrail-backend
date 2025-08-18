import mongoose from "mongoose";
import User from "../models/user.model.js";


export const findUserByEmail = async(email)=>{
    return await User.findOne({ email });
}
export const createUser = async (userData)=>{
    const user = await new User(userData);
    return await user.save();
}