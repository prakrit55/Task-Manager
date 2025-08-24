import { Request, Response } from "express";
import Task from "../models/Task";

export const getTasks = async (req: Request, res: Response) => {
    try {
        const { status } = req.query;
         let filter: Record<string, any> = {};

        if (status) {
            filter.status = status;
        }

        let tasks;

        if (req.user.role === "admin") {
            tasks = await Task.find(filter).populate(
                "assignedTo",
                "name email profileImageUrl"
            )
        }else {
            tasks = await Task.find({ ...filter, assignedTo: req.user._id }).populate(
                "assignedTo",
                "name email profileImageUrl"  
            )
        }

        tasks = await Promise.all(
            tasks.map(async (task) => {
                const obj = task.toObject();
                const completedCount = task.todoChecklists.filter(
                    (item) => item.completed
                ).length;
                return { ...obj, completedTodoCount: completedCount };
            })
        );

        const allTasks = await Task.countDocuments(
            req.user.role === "admin" ? {} : { assignedTo: req.user._id }
        )

        const pendingTasks = await Task.countDocuments({
            ...filter,
            status: "Pending",
            ...(req.user.role !== "admin" && { assignedTo: req.user._id })
        });

        const inProgressTasks = await Task.countDocuments({
            ...filter,
            status: "In progress",
            ...(req.user.role !== "admin" && { assignedTo: req.user._id })
        });

        const completedTasks = await Task.countDocuments({
            ...filter,
            status: "Completed",
            ...(req.user.role !== "admin" && { assignedTo: req.user._id })
        });

        res.json({
            tasks,
            statusSummary: {
                all: allTasks,
                pendingTasks,
                inProgressTasks,
                completedTasks,
            }
        })
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error })
    }
}

export const getTasksById = (req: Request, res: Response) => {
    try {
        
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error })
    }
}

export const createTasks = async (req: Request, res: Response) => {
    try {
        const {
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            attachments,
            todoCheckLists
        } = req.body;

        if (!Array.isArray(assignedTo)) {
            return res.
            status(400).
            json({ message: "AssignedTo must be array of user IDs" });
        }

        const task = await Task.create({
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            createdBy: req.user._id,
            attachments,
            todoCheckLists
        });
        res.status(201).json({ message: "Task Created Successfully !", task })
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error })
    }
}

export const updateTask = async (req: Request, res: Response) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) return res.status(404).json({message: "Couldnot find task!"});

        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.priority = req.body.priority || task.priority;
        task.dueDate = req.body.dueDate || task.dueDate;
        task.todoChecklists = req.body.todoChecklists || task.todoChecklists;
        task.attachments = req.body.attachments || task.attachments;

        if (req.body.assignedTo) {
            if (!Array.isArray(req.body.assignedTo)){

            }
            task.assignedTo = req.body.assignedTo
        }
        const updatedTask = await task.save();
        res.status(201).json({ message: "Task Updated Successfully !", updateTask })
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error })
    }
}

export const deleteTask = (req: Request, res: Response) => {
    try {
        
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error })
    }
}

export const updateTaskStatus = async (req: Request, res: Response) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({message: "Task noot found!"});

        const isAssigned = task.assignedTo.some(
            (userId) => userId.toString === req.user._id
        );

        if (!isAssigned && req.user.role !== "admin"){
            res.status(403).json({message: "Not authorized to update task checklists"});
        };

        task.status = req.body.status || task.status;

        if (task.status === "Completed") {
            task.todoChecklists.forEach((item) => (item.completed = true));
            task.progress = 100;
        }

        await task.save();
        res.status(201).json({ message: "Task Status Successfully !" })
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error })
    }
}

export const updateTaskChecklists = async (req: Request, res: Response) => {
    try {
        const todoCheckLists = req.body;

        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({message: "Task noot found!"});

        if (!task.assignedTo.includes(req.user._id) && req.user.role !== "admin") {
            res.status(403).json({message: "Not authorized to update task checklists"});
        }

        task.todoChecklists = todoCheckLists;

        const completedCount = task.todoChecklists.filter(
            (item) => item.completed
        ).length;

        const totalTodoLists = task.todoChecklists.length;
        task.progress = totalTodoLists > 0 ? Math.round((completedCount/totalTodoLists) * 100) : 0;

        if (task.progress === 100) {
            task.status = "Completed"
        }else if (task.progress > 0) {
            task.status = "In Progress"
        }else {
            task.status = "Pending"
        }

        await task.save();
        const updatedTask = await Task.findById(req.params.id).populate(
            "assignedTo",
            "name email profileImageUrl",
        );
        res.status(201).json({ message: "Task Checklists Successfully !", updatedTask })

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error })
    }
}

export const getDashboardData = async (req: Request, res: Response) => {
    try {
        const totalTasks = await Task.countDocuments();
        const pendingTasks = await Task.countDocuments({ status: "Pending" });
        const completedTasks = await Task.countDocuments({ status: "Completed" });
        const overDueTasks =await  Task.countDocuments({
            status: { $ne: "Completed" },
            dueDate: {  $lt: new Date() },
        });
        const taskStatuses = ["Pending", "In Progress", "Completed"];
        const taskDistributedRaw = await Task.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ])
        const taskDistribution = taskStatuses.reduce<Record<string, number>>((acc, status) => {
            const formattedKey = status.replace(/\s+/g, "");
            acc[formattedKey] = taskDistributedRaw.find((item) => item._id === status)?.count || 0;
            return acc;
        }, {});
        taskDistribution["All"] = totalTasks;

        const taskPriorities = ["Low", "Medium", "High"];
        const taskPriorityLevelRaw = await Task.aggregate([
            {
                $group: {
                    _id: "$priority",
                    count: { $sum: 1 },
                },
            },
        ]);

        const taskPriorityLevels = taskPriorities.reduce<Record<string, number>>((acc, priority) => {
            acc[priority] = taskPriorityLevelRaw.find((item) => item._id === status)?.count || 0;
            return acc;
        }, {});
        const recentTasks = await Task.find().
        sort({ createdAt: -1 }).
        limit(10).
        select("title status priority dueDate createdAt");

        res.status(200).json({
            statistics:{
                totalTasks,
                pendingTasks,
                completedTasks,
                overDueTasks,
            },
            charts: {
                taskDistribution,
                taskPriorityLevels,
            },
            recentTasks,
        });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error })
    }
}

export const getUserDashboardData = async (req: Request, res: Response) => {
    try {
        const userId = req.params._id

        const totalTasks = await Task.countDocuments();
        const pendingTasks = await Task.countDocuments({ status: "Pending" });
        const completedTasks = await Task.countDocuments({ status: "Completed" });
        const overDueTasks = await Task.countDocuments({
            assignedTo: userId,
            status: { $ne: "Completed" },
            dueDate: {  $lt: new Date() },
        });
        const taskStatuses = ["Pending", "In Progress", "Completed"];
        const taskDistributedRaw = await Task.aggregate([
            { $match: { assignedTo: userId }},
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ])
        const taskDistribution = taskStatuses.reduce<Record<string, number>>((acc, status) => {
            const formattedKey = status.replace(/\s+/g, "");
            acc[formattedKey] = taskDistributedRaw.find((item) => item._id === status)?.count || 0;
            return acc;
        }, {});
        taskDistribution["All"] = totalTasks;

        const taskPriorities = ["Low", "Medium", "High"];
        const taskPriorityLevelRaw = await Task.aggregate([
            { $match: { assignedTo: userId }},
            {
                $group: {
                    _id: "$priority",
                    count: { $sum: 1 },
                },
            },
        ]);

        const taskPriorityLevels = taskPriorities.reduce<Record<string, number>>((acc, priority) => {
            acc[priority] = taskPriorityLevelRaw.find((item) => item._id === status)?.count || 0;
            return acc;
        }, {});
        const recentTasks = await Task.find({ assignedTo: userId }).
        sort({ createdAt: -1 }).
        limit(10).
        select("title status priority dueDate createdAt");

        res.status(200).json({
            statistics:{
                totalTasks,
                pendingTasks,
                completedTasks,
                overDueTasks,
            },
            charts: {
                taskDistribution,
                taskPriorityLevels,
            },
            recentTasks,
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error })
    }
}