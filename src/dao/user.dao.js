import mongoose from "mongoose";
import User from "../models/user.model.js";


export const findUserByEmail = async(email)=>{
    return await User.findOne({ email });
}
export const createUser = async (userData)=>{
    const user = await new User(userData);
    return await user.save();
}
export const updateUser = async (userId, updateData)=>{
    return await User.findByIdAndUpdate(userId, { $set: updateData }, { new: true });
}
export const findUserById = async (userId) => {
    return await User.findById(userId).select("-password");
}