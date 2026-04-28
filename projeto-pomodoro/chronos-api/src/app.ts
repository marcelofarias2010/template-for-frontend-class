import cors from 'cors';
import express from 'express';
import { settingsRouter } from './routes/settings.routes.js';
import { tasksRouter } from './routes/tasks.routes.js';

export const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  return res.json({ ok: true });
});

app.use('/settings', settingsRouter);
app.use('/tasks', tasksRouter);
