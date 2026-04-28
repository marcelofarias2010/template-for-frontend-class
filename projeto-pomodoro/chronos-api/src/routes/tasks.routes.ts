import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

export const tasksRouter = Router();

function serializeTask(
  task: Awaited<ReturnType<typeof prisma.task.findFirst>>,
) {
  if (!task) return task;

  return {
    ...task,
    startDate: task.startDate.toString(),
    completeDate: task.completeDate?.toString() ?? null,
    interruptDate: task.interruptDate?.toString() ?? null,
  };
}

tasksRouter.get('/', async (_req, res) => {
  const tasks = await prisma.task.findMany({
    orderBy: { startDate: 'desc' },
  });

  return res.json(tasks.map(serializeTask));
});

tasksRouter.post('/', async (req, res) => {
  const { id, name, duration, type, startDate } = req.body as {
    id: string;
    name: string;
    duration: number;
    type: string;
    startDate: number;
  };

  if (!id || !name || !Number.isInteger(duration) || !Number.isInteger(startDate)) {
    return res.status(400).json({ message: 'Payload inválido para criação de task' });
  }

  const task = await prisma.task.create({
    data: { id, name, duration, type, startDate: BigInt(startDate) },
  });

  return res.status(201).json(serializeTask(task));
});

tasksRouter.patch('/:id/complete', async (req, res) => {
  const { id } = req.params;
  const { completeDate } = req.body as { completeDate: number };

  if (!Number.isInteger(completeDate)) {
    return res.status(400).json({ message: 'completeDate inválido' });
  }

  const task = await prisma.task.update({
    where: { id },
    data: { completeDate: BigInt(completeDate) },
  });

  return res.json(serializeTask(task));
});

tasksRouter.patch('/:id/interrupt', async (req, res) => {
  const { id } = req.params;
  const { interruptDate } = req.body as { interruptDate: number };

  if (!Number.isInteger(interruptDate)) {
    return res.status(400).json({ message: 'interruptDate inválido' });
  }

  const task = await prisma.task.update({
    where: { id },
    data: { interruptDate: BigInt(interruptDate) },
  });

  return res.json(serializeTask(task));
});

tasksRouter.delete('/', async (_req, res) => {
  await prisma.task.deleteMany();
  return res.status(204).send();
});
