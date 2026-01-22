import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Department } from '../entities/department.entity';
import { Employee } from '../entities/employee.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'nomini.db',
      entities: [User, Department, Employee],
      synchronize: true,
      logging: true,
    }),
  ],
})
export class DatabaseModule {}
