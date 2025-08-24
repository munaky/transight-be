import express from 'express';

/* Middleware */
import { cors } from './middlewares/cors';
import { limiter } from './middlewares/rate-limiter';
import { session } from './middlewares/session';
import { isAuthenticated } from './middlewares/isAuthenticated';
import { isAdmin } from './middlewares/isAdmin';
import { errorHandler } from './middlewares/error-handler';

/* Routes */
import authRoutes from './routes/auth-routes';
import userRoutes from './routes/user/index';
import adminRoutes from './routes/admin/index';

/* Global Variable */
import {globals} from './globals'

const app = express();
const port = globals.PORT;

app.use(express.json());
app.use(limiter);
app.use(cors);
app.use(session);

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);

app.use(errorHandler);

app.listen(port, () => console.log(`run on port ${port}`));