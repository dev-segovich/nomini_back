import { DataSource } from 'typeorm';
import { User } from './src/entities/user.entity';
import { Department } from './src/entities/department.entity';
import { Employee } from './src/entities/employee.entity';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'nomini.db',
  entities: [User, Department, Employee],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: true,
});
