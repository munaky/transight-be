import multer from 'multer';
import path from 'path';
import { globals } from '../globals';

const storage = multer.diskStorage({
    destination: globals.UPLOAD_PATH,
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);

        cb(null, `${Date.now()}${extension}`);
    }
})

export const uploadImage = multer({
    storage,
    limits: {
        fileSize: 2 * 1000000 //2mb
    },
    fileFilter: function (req, file, callback) {
        const allowedExtension = ['.png', '.jpg', '.jpeg'];
        const extension = path.extname(file.originalname);

        if(!allowedExtension.includes(extension)) {
            return callback(new Error('only [png, jpeg, jpg] are allowed'))
        }

        callback(null, true)
    },
}).single('image');