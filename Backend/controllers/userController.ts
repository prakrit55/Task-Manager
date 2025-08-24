import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import User from "../models/User";
import Task from "../models/Task";


export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find({ role: 'member' }).select('-password');

        const usersWithCountTasks = await Promise.all(
            users.map(async (user) => {
                const pendingTasks = await Task.countDocuments({
                    assignedTo: user._id,
                    status: "Pending",
                });
                const inProgressTasks = await Task.countDocuments({
                    assignedTo: user._id,
                    status: "In Progress"
                });
                const completedTasks = await Task.countDocuments({
                    assignedTo: user._id,
                    status: "Completed"
                });

                return{
                    ...user._doc,
                    pendingTasks,
                    inProgressTasks,
                    completedTasks,
                };
            })
        )
    } catch (error) {
        res.status(500).json({ message: "Server Error" + error })
    }
}

export const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message : "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server Error" + error })
    }
}