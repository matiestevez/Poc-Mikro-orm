import { MikroORM } from '@mikro-orm/core';
import { Request, Response } from 'express';
import express from 'express';
import cors from 'cors';
import { Task } from './Task';
import config from './mikro-orm.config';

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors()); // Permite peticiones desde el front-end

let orm: MikroORM;

(async () => {
  orm = await MikroORM.init(config);

  // Endpoint para obtener todas las tareas
  app.get('/tasks', async (req: Request, res: Response) => {
    const em = orm.em.fork();
    try {
      const tasks = await em.findAll(Task);
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las tareas.' });
    }
  });

  // Endpoint para obtener una tarea por su ID
  app.get('/tasks/:id', async (req: Request, res: Response) => {
    const em = orm.em.fork();
    try {
      const task = await em.findOne(Task, { id: parseInt(req.params.id) });
      if (!task) {
        return res.status(404).json({ error: 'Tarea no encontrada.' });
      }
      res.status(200).json(task);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la tarea.' });
    }
  });

  // Endpoint para crear una nueva tarea
  app.post('/tasks', async (req: Request, res: Response) => {
    const em = orm.em.fork();
    try {
      const { title } = req.body;
      if (!title) {
        return res.status(400).json({ error: 'El título es requerido.' });
      }
      const newTask = new Task(title);
      await em.persistAndFlush(newTask);
      res.status(201).json(newTask);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear la tarea.' });
    }
  });

  // Endpoint para actualizar una tarea (marcar como completada)
  app.put('/tasks/:id', async (req: Request, res: Response) => {
    const em = orm.em.fork();
    try {
      const task = await em.findOne(Task, { id: parseInt(req.params.id) });
      if (!task) {
        return res.status(404).json({ error: 'Tarea no encontrada.' });
      }
      task.completed = req.body.completed;
      await em.flush();
      res.status(200).json(task);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar la tarea.' });
    }
  });

  // Endpoint para eliminar una tarea
  app.delete('/tasks/:id', async (req: Request, res: Response) => {
    const em = orm.em.fork();
    try {
      const task = await em.findOne(Task, { id: parseInt(req.params.id) });
      if (!task) {
        return res.status(404).json({ error: 'Tarea no encontrada.' });
      }
      await em.removeAndFlush(task);
      res.status(204).send(); // 204 No Content
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar la tarea.' });
    }
  });

  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
})().catch(console.error);