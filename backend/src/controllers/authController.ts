import { NextFunction, Request, Response } from "express";
import User from "../models/userModel";
import ErrorResponse from "../utils/errorResponse";


export const signup = async (req:Request, res:Response, next: NextFunction) =>{
    const {email} = req.body;
    const userExist = await User.findOne({email});
    if(userExist){
        return next(new ErrorResponse("Email already registered",400))
    }
    try {
        req.body.role = "user";
        req.body.active = false;
        const user = await User.create(req.body);
        res.status(201).json({
            success: true,
            user
        })
    } catch (error) {
        next(error)
    }
}