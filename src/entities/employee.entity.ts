import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Department } from './department.entity';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column()
  position: string;

  @Column({ type: 'date' })
  hireDate: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  baseWeeklySalary: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  weeklyBonus: number;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ default: 'activo' })
  status: string;

  @Column({ default: 'semanal' })
  paymentFrequency: string;

  @ManyToOne(() => Department, { onDelete: 'SET NULL', eager: true })
  @JoinColumn({ name: 'departmentId' })
  department: Department;

  @Column({ nullable: true })
  departmentId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
