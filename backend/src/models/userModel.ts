import mongoose , {Schema} from "mongoose";
import { IUser } from "../types/IUser";
import bcrypt from "bcrypt";


const userSchema = new Schema<IUser>(
    {
        firstName:{
            type:String,
            trim: true,
            required: [true, "Name is required"],
            maxLength: 32
        },
        lastName:{
            type:String,
            trim: true,
            required: [true, "Name is required"],
            maxLength: 32
        },
        email: {
            type: String,
            trim: true,
            required: [true, "e-mail is required"],
            unique: true,
            match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please add a valid e-mail",
            ],
        },
        password: {
        type: String,
        trim: true,
        required: [true, "password is required"],
        minLength: [6, "Password must have at least (6) characters"],
        },
    
        role: {
        type: String,
        default: "user",
        },
    
        active: {
        type: Boolean,
        default: false,
        },

        resetPasswordToken: String,
        resetPasswordExpire: Date,
    },
    {timestamps:true}
);

userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next();
    }
    const salt =  await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

const User = mongoose.model("User", userSchema)
export default User