import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PayrollCycle } from './payroll-cycle.entity';

@Entity('payroll_summaries')
export class PayrollSummary {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  employeeId: string;

  @Column()
  name: string;

  @Column()
  department: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  basePay: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  theoreticalBase: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unpaidDaysAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  holidayExtraPay: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  extraHoursCount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  extraHoursPay: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  bonus: number;

  @Column()
  daysWorked: number;

  @Column()
  holidaysWorked: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  loanDeduction: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  penalizationDeduction: number;

  @Column({ type: 'json', nullable: true })
  dailyAttendance: string[];

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @ManyToOne(() => PayrollCycle, (cycle) => cycle.summaries, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'cycleId' })
  cycle: PayrollCycle;

  @Column()
  cycleId: string;
}
