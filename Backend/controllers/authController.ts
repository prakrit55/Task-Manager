import { Request, Response } from 'express';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User';

export const generateToken = (userId: string, email: string, verified: boolean) => {
    return jwt.sign({ id: userId, email, verified }, process.env.JWT_SECRET as string, { expiresIn: "7d" });
};

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, adminInviteToken, imageUrl } = req.body.email;

        const existingUser  = await User.findOne( { email } );
        if (existingUser) {
            res.status(401).json( { message: "User Already Present !"} )
        }

        let role = "member"
        if (adminInviteToken && adminInviteToken == process.env.ADMIN_INVITE_TOKEN) {
            role = "admin"
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPwd = await bcrypt.hash(password, salt)

        const user = await User.create(
            {
                name,
                email,
                password: hashedPwd,
                role,
                imageUrl
            }
        )
        res.
        status(201).
        json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImageUrl: user.profileImageUrl,
            // token: generateToken(user._id.toString()),

        });
    } catch (error) {
        res.status(500).json( { message: "Server Error", error: error} ); 
    }
};

export const loginUser = async ( req: Request, res: Response ) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({email}).select('+password')
            if (!existingUser) {
                return res.status(401).json( { success: false, error: "Couldnot find User !"} )
            }

        const pwdVerify = await bcrypt.compare(password, existingUser.password);
        if (!pwdVerify) {
            return res.
            status(401).
            json({success: false, error: "Invalid credentials"});
        }

        const token = generateToken(existingUser._id.toString(), existingUser.email, existingUser.verified ?? false);
        res.cookie('Authorization', 'Bearer '+ token, {
            expires: new Date(Date.now() + 8 * 3600000),
            httpOnly: process.env.NODE_DEV === 'production',
        }).
        json({
            success: true,
            token,
            message: "Login Successful!"
        });
    } catch (error) {
        res.status(500).json( { message: "Server Error", error: error} );
    }
};

export const logout = async (req: Request, res: Response) => {
    res.
    clearCookie('Authorization').
    status(200).
    json({success: true, message: "Logout successful"});
}

export const getUserProfile = async ( req: Request, res:Response ) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        if (!user) {
            return res.status(404).json({ message: "User Not found!"})
        }
        res.json(user)
    } catch (error) {
        res.status(401).json( { error:error } )
    }
};

export const updateUserProfile = async ( req: Request, res: Response ) => {

};