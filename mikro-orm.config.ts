import { Options } from '@mikro-orm/core';
import { MySqlDriver } from "@mikro-orm/mysql";
import { Task } from './Task';

const config: Options = {
  entities: [Task],
  dbName: 'poc',
  driver: MySqlDriver,
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Fliaestevez01', // ⚠️ Cambia esto por tu contraseña de MySQL
};

export default config;