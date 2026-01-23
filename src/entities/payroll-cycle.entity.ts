import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { PayrollSummary } from './payroll-summary.entity';

@Entity('payroll_cycles')
export class PayrollCycle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  date: string;

  @Column()
  label: string;

  @Column({ default: 'semanal' })
  type: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  totalDisbursement: number;

  @OneToMany(() => PayrollSummary, (summary) => summary.cycle, {
    cascade: true,
  })
  summaries: PayrollSummary[];

  @CreateDateColumn()
  createdAt: Date;
}
