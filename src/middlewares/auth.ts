import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function verifyUser(req: Request, res: Response, next: NextFunction) {
    const allowedPaths = ['/signup', '/login'];

    if (allowedPaths.includes(req.path)) {
        console.log('dale')
        next();
    }else{
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }
    
        const [, tokenString] = token.split(" ");
    
        const result = jwt.verify(tokenString, process.env.TOKEN_SECRET as string,  (err, decoded) => {
    
            req.user_id = (decoded as JwtPayload).id ;
    
            if (err) {
                return res.status(401).json({ message: "Invalid token" });
            }
    
            
    
            next();
        });
    }

    
}