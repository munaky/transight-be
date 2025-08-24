import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export const globals: any = {
    ...process.env,
    APP_PATH: path.join(__dirname, '..'),
    FULL_UPLOAD_PATH: path.join(__dirname, '..', process.env.UPLOAD_PATH as string)
}