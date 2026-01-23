import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Department } from '../entities/department.entity';
import { Employee } from '../entities/employee.entity';
import { Loan } from '../entities/loan.entity';
import { Penalization } from '../entities/penalization.entity';
import { PayrollCycle } from '../entities/payroll-cycle.entity';
import { PayrollSummary } from '../entities/payroll-summary.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'nomini.db',
      entities: [
        User,
        Department,
        Employee,
        Loan,
        Penalization,
        PayrollCycle,
        PayrollSummary,
      ],
      synchronize: true,
      logging: true,
    }),
  ],
})
export class DatabaseModule {}
