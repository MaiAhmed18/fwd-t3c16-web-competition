import { Request, Response, NextFunction } from "express";

import jwt from "jsonwebtoken"


export const verifyAuthToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorizationHeader = req.headers.authorization
        if (!authorizationHeader) throw new Error(`Token Required On Header`)
        const token = authorizationHeader.split(' ')[1]
        jwt.verify(token, process.env.TOKEN_SECRET as string)
        next()
    } catch (error) {
        res.status(401)
        res.json({ message: 'Invalid token' });
    }
}