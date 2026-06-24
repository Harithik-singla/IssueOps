import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import workspaceRoutes from './routes/workspaceRoutes.js';
import projectRoutes   from './routes/projectRoutes.js';


const app = express();

app.use(helmet());
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ── Health check ───────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

//test
app.post('/test', (req, res) => {
  console.log('body:', req.body);
  console.log('headers:', req.headers);
  res.json({ body: req.body });
});

// ── Routes ─────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/workspaces/:workspaceId/projects', projectRoutes);
app.use('/api/projects', projectRoutes);



// ── 404 handler ───────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.url} not found` });
});

const httpServer = http.createServer(app);

const start = async () => {
  await connectDB();
  httpServer.listen(ENV.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${ENV.PORT}`);
  });
};

start();