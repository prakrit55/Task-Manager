import { Request, Response } from "express";
import User from "../models/User";
import exceljs from "exceljs";
import Task from "../models/Task";

interface UserTaskData {
  name: string;
  email: string;
  taskCount: number;
  pendingTasks: number;
  inProgressTasks: number;
  completedTasks: number;
}

export const exportTasksReport = async (req: Request, res: Response) => {
    try {
        const tasks = await Task.find().populate("assignedTo", "name email");

        const workbook = new exceljs.Workbook();
        const worksheet = workbook.addWorksheet("Tasks Report");

        worksheet.columns = [
            { header: "Task ID", key: "_id", width: 25},
            { header: "Title", key: "title", width: 30},
            { header: "Description", key: "description", width: 50},
            { header: "Priority", key: "priority", width: 15},
            { header: "Status", key: "status", width: 20},
            { header: "Due Date", key: "dueDate", width: 20},
            { header: "Assigned To", key: "assignedTo", width: 30}
        ]

        tasks.forEach((task) => {
            const assignedTo = task.assignedTo.map((user: any) => 
                `${user.name} (${user.email})`).join(", ");
            worksheet.addRow({
                _id: task._id,
                title: task.title,
                description: task.description,
                priority: task.priority,
                status: task.status,
                dueDate: task.dueDate.toISOString().split("T")[0],
                assignedTo: assignedTo || "Unassigned"
            });
        });

       res.setHeader(
         "Content-Type",
         "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=tasks_report.xlsx"
        );
        return workbook.xlsx.write(res).then(() =>{
            res.end();
        });
    } catch (error) {
        res.
        status(500).
        json({ message: "Error exporting tasks!", error: error})
    }
};


export const usersReport = async ( req: Request, res: Response ) => {
    try {
        const user = await User.find().select("name email _id").lean();
        const userTask = await Task.find().populate(
            "assignedTo",
            "name email _id",
        )

        const userTaskMap: Record<string, UserTaskData> = {};
        user.forEach((user) => {
            userTaskMap[user._id.toString()] = {
                name: user.name,
                email: user.email,
                taskCount: 0,
                pendingTasks: 0,
                inProgressTasks: 0,
                completedTasks: 0,
            }
        });

        userTask.forEach((task) => {
            if (task.assignedTo) {
                task.assignedTo.forEach((assignedUser) => {

                    if (!assignedUser) return;
            
                    const userKey = assignedUser._id.toString();
                    const userData = userTaskMap[userKey];
            
                    if (!userData) return;

                    if (userTaskMap[userKey]) {
                        userTaskMap[userKey].taskCount += 1;
                        if (task.status === "Pending") {
                            userTaskMap[userKey].pendingTasks += 1;
                        }else if (task.status === "In Progress") {
                            userTaskMap[userKey].inProgressTasks += 1;
                        }else if (task.status === "Completed") {
                            userTaskMap[userKey].completedTasks += 1;
                        }
                    }
                });
            }
        });

        const workbook = new exceljs.Workbook();
        const worksheet = workbook.addWorksheet("User Task Report");

        worksheet.columns = [
            {header: "User Name", key: "name", width: 30},
            {header: "Email", key: "email", width: 40},
            {header: "Total Assigned Tasks", key: "taskCount", width: 20},
            {header: "Pending Tasks", key: "pendingTasks", width: 20},
            {header: "In Progress Tasks", key: "inProgressTasks", width: 20},
            {header: "Completed Tasks", key: "completedTasks", width: 20},
        ];

        Object.values(userTaskMap).forEach((element) => {
            worksheet.addRow(user);
        });

        res.setHeader(
         "Content-Type",
         "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=tasks_report.xlsx"
        );

        return workbook.xlsx.write(res).then(() => {
            res.end();
        });
    } catch (error) {
        res.
        status(500).
        json({ message: "Error exporting tasks!", error: error})
    }
};