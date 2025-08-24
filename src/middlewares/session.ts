import s from 'express-session';
import { globals } from '../globals';

export const session = s({
    secret: globals.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
});