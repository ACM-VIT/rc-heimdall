import * as config from 'config';

import { TypeOrmModuleOptions } from '@nestjs/typeorm';

/** load database configurations */
const dbConfig = config.get('database');

/**
 * initialize database connection based on config file(s)
 */
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: dbConfig.type,
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.db_name,
  entities: [__dirname + '/../**/*.entity.js'],
  synchronize: dbConfig.synchronize,
};
