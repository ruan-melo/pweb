import { NextFunction, Request, Response } from "express";

export function errorHandling(err: any, req:Request, res: Response, next: NextFunction)  {

    return res.status(500).json({message: 'An error has occurred'});

   
    next(err);
};