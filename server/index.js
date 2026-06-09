import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import healthRouter from './src/routes/health.js';
import authRouter from './src/routes/auth.js';
import workerRouter from './src/routes/worker.js';
import employerRouter from './src/routes/employer.js';
import jobsRouter from './src/routes/jobs.js';
import applicationsRouter from './src/routes/applications.js';
import adminRouter from './src/routes/adminRoutes.js';
import { errorHandler } from './src/middleware/errorHandler.js';
const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration: restrict to production client URL in production, allow all in dev
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like curl, postman, mobile apps, or local scripts)
    if (!origin) return callback(null, true);
    if (process.env.NODE_ENV === 'production') {
      if (origin === process.env.CLIENT_URL) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'));
      }
    }
    // In development, allow the requesting origin dynamically (resolves wildcard credentials conflict)
    callback(null, true);
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/worker', workerRouter);
app.use('/api/employer', employerRouter);
app.use('/api', jobsRouter);
app.use('/api', applicationsRouter);
app.use('/api/admin', adminRouter);

// Global Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
