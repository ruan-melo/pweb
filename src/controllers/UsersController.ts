import { prisma } from "../database";
import jwt from 'jsonwebtoken';

import {Request, Response} from 'express';

export class UsersController{

    async profile(request: Request, response: Response){
        const {user_id} = request;

        const user = await prisma.user.findFirst({where: {id: user_id}, include: {tasks: true}});

        if (!user){
            return response.status(404).json({message: 'User not found'});
        }

        const {password: userPassword, ...userWithoutPassword} = user;

        return response.json(userWithoutPassword);
    }

    async findById(request: Request, response: Response){
        const {id} = request.params;
        const user = await prisma.user.findFirst({where: {id: Number(id)}});

       
        return response.json(user);
        
    }

    async findByEmail(request: Request, response: Response){
        const {email} = request.body;
        const user = await prisma.user.findFirst({where: {email}});

        return response.json(user);
    }

    async signUp(request: Request, response: Response){
        const {name, email, password}  = request.body;

        const userAlreadyExists = await prisma.user.findFirst({where: {email}});

        if(userAlreadyExists){
            return response.status(400).json({message: 'Email is already in use'});
        }

        const {password: userPassword, ...user} = await prisma.user.create({data: {name, email, password}, include: {tasks: true} });

        const token = jwt.sign({id: user.id }, process.env.TOKEN_SECRET as string, {expiresIn: '1d'});

        return response.status(201).json({ user, token});
    }

    async login(request: Request, response: Response){
        const {email, password}  = request.body;

        const user = await prisma.user.findFirst({where: {email}, include: {tasks: true}});

        console.log('Eita');

        if(!user || user.password !== password){
            return response.status(401).json({message: 'Invalid credentials'});
        }

        const {password: userPassword, ...userWithoutPassword} = user;

        const token = jwt.sign({id: user.id }, process.env.TOKEN_SECRET as string, {expiresIn: '1d'});

        return response.status(200).json({user: userWithoutPassword, token });
    }

}