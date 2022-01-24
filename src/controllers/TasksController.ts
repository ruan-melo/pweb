import { Request, Response } from "express";
import { prisma } from "../database";

export class TasksController{

    async findByUser(request: Request, response: Response){
        const userId = Number(request.user_id);

        const tasks = await prisma.task.findMany({where: {author: {id: userId}}});

        return response.json(tasks);
    }

    async findById(request: Request, response: Response){
        const {id} = request.params;

        const task = await prisma.task.findFirst({where: {id: Number(id)}});

        return response.json(task);
    }

    async create(request: Request, response: Response ){
        const {title, description} = request.body;
        const userId = Number(request.user_id);

        const task = await prisma.task.create({data: {title, description, author: {connect: {id: userId}}}});

        return response.status(201).json(task);

    }

    async delete(request: Request, response: Response){
        const {id} = request.params;
        const userId = Number(request.user_id);

        const task = await prisma.task.findFirst({where: {id: Number(id)}});
        
        if (!task){
            return response.status(404).json({message: 'Task not found'});
        }

        if(task.authorId !== userId){
            return response.status(403).json({message: 'You are not allowed to update this task'});
        }

        await prisma.task.delete({where: {id: Number(id)}});

        return response.status(204).json()
    }


    async done(request: Request, response: Response){
        const {id} = request.params;
        const {done} = request.body;

        const userId = Number(request.user_id);

        const task = await prisma.task.update({where: {id: Number(id)}, data: {done}});

        if (!task){
            return response.status(404).json({message: 'Task not found'});
        }

        if(task.authorId !== userId){
            return response.status(403).json({message: 'You are not allowed to update this task'});
        }

        const updatedTask = await prisma.task.update({where: {id: Number(id)}, data: {done}});

        return response.json(updatedTask);
    }
}