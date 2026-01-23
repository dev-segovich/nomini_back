import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Employee } from './employee.entity';

@Entity('loans')
export class Loan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column()
  totalWeeks: number;

  @Column()
  remainingWeeks: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  weeklyInstallment: number;

  @Column({ type: 'date' })
  dateRequested: string;

  @Column({ default: 'active' })
  status: string;

  @Column({ nullable: true })
  notes: string;

  @ManyToOne(() => Employee, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @Column()
  employeeId: string;

  @CreateDateColumn()
  createdAt: Date;
}
