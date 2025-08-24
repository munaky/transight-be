import jwt from 'jsonwebtoken';
import { globals } from '../globals';

export const signToken = (payload: object) => {
    return jwt.sign(payload, globals.JWT_SECRET, {expiresIn: '1d'});
}

export const verifyToken = (token: string) => {
    return jwt.verify(token, globals.JWT_SECRET);
}