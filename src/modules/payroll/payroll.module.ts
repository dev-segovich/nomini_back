import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayrollCycle } from '../../entities/payroll-cycle.entity';
import { PayrollSummary } from '../../entities/payroll-summary.entity';
import { Loan } from '../../entities/loan.entity';
import { Penalization } from '../../entities/penalization.entity';
import { Employee } from '../../entities/employee.entity';
import { PayrollController } from './payroll.controller';
import { PayrollService } from './payroll.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PayrollCycle,
      PayrollSummary,
      Loan,
      Penalization,
      Employee,
    ]),
  ],
  controllers: [PayrollController],
  providers: [PayrollService],
})
export class PayrollModule {}
