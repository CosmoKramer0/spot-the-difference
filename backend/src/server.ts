import express from 'express';
import cors from 'cors';
// import helmet from 'helmet'; // Temporarily disabled for CORS debugging
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import gameRoutes from './routes/game';
import iconRoutes from './routes/icons';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

console.log('NODE_ENV:', process.env.NODE_ENV || 'undefined');

// CORS configuration - Allow all origins
app.use(cors({
  origin: true,
  credentials: true
}));

// Raw body capture middleware for text/plain requests
app.use('/api/game/complete', (req, res, next) => {
  if (req.headers['content-type']?.includes('text/plain')) {
    let rawBody = '';
    req.on('data', chunk => rawBody += chunk);
    req.on('end', () => {
      (req as any).rawBody = rawBody;
      next();
    });
  } else {
    next();
  }
});

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

app.get('/api/health', (req, res) => {
  res.json({ message: 'The Search Game API is running!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/icons', iconRoutes);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});