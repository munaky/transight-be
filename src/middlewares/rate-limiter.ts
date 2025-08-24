import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
    windowMs: 60 * 1000, //60 sec
    limit: 60,
    message: 'terlalu banyak request, coba lain kali'
}); 