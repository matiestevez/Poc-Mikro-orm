import { MikroORM } from '@mikro-orm/core';
import { Task } from './Task';
import config from './mikro-orm.config';

(async () => {
  const orm = await MikroORM.init(config);
  // Usa fork() para obtener un EntityManager propio
  const em = orm.em.fork();

  console.log('Creando una nueva tarea...');
  const newTask = new Task('Aprender a usar MikroORM');
  await em.persistAndFlush(newTask);
  console.log('Tarea creada con ID:', newTask.id);

  // 2. Encontrar una tarea por su ID
  console.log('Buscando la tarea con ID:', newTask.id);
  const foundTask = await em.findOne(Task, { id: newTask.id });
  if (foundTask) {
    console.log('Tarea encontrada:', foundTask.title);

    // 3. Actualizar la tarea
    console.log('Actualizando la tarea...');
    foundTask.completed = true;
    await em.flush();
    console.log('Tarea actualizada a completada:', foundTask.completed);

    // 4. Listar todas las tareas
    console.log('Listando todas las tareas...');
    const allTasks = await em.findAll(Task);
    console.log('Número de tareas:', allTasks.length);

    allTasks.forEach((task: Task) => {
      console.log(`- [${task.completed ? '✅' : '❌'}] ${task.title} (ID: ${task.id})`);
    });

    // 5. Eliminar la tarea (opcional)
    console.log('Eliminando la tarea...');
    await em.removeAndFlush(foundTask);
    console.log('Tarea eliminada.');
  }

  // Cierra la conexión
  await orm.close();
  console.log('Conexión cerrada.');

})().catch(console.error);