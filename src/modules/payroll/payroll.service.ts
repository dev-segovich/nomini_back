import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { PayrollCycle } from '../../entities/payroll-cycle.entity';
import { PayrollSummary } from '../../entities/payroll-summary.entity';
import { Loan } from '../../entities/loan.entity';
import { Penalization } from '../../entities/penalization.entity';
import { Employee } from '../../entities/employee.entity';

@Injectable()
export class PayrollService {
  constructor(
    @InjectRepository(PayrollCycle)
    private readonly cycleRepository: Repository<PayrollCycle>,
    @InjectRepository(PayrollSummary)
    private readonly summaryRepository: Repository<PayrollSummary>,
    @InjectRepository(Loan)
    private readonly loanRepository: Repository<Loan>,
    @InjectRepository(Penalization)
    private readonly penalizationRepository: Repository<Penalization>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll() {
    return await this.cycleRepository.find({
      relations: ['summaries'],
      order: { date: 'DESC' },
    });
  }

  async create(createDto: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { summaries, updatedLoans, updatedPenalizations, ...cycleData } =
        createDto;

      // Save the cycle
      const cycle = this.cycleRepository.create({
        ...cycleData,
      });
      const savedCycle = (await queryRunner.manager.save(
        cycle,
      )) as unknown as PayrollCycle;

      // Save summaries
      const summaryEntities = summaries.map((s) =>
        this.summaryRepository.create({
          ...s,
          cycleId: savedCycle.id,
          dailyAttendance: s.dailyAttendance || [],
        }),
      );
      await queryRunner.manager.save(summaryEntities);

      // Update loans if provided
      if (updatedLoans && Array.isArray(updatedLoans)) {
        for (const l of updatedLoans) {
          await queryRunner.manager.update(Loan, l.id, {
            remainingWeeks: l.remainingWeeks,
            status: l.status,
          });
        }
      }

      // Update penalizations if provided
      if (updatedPenalizations && Array.isArray(updatedPenalizations)) {
        for (const p of updatedPenalizations) {
          await queryRunner.manager.update(Penalization, p.id, {
            remainingWeeks: p.remainingWeeks,
            status: p.status,
          });
        }
      }

      await queryRunner.commitTransaction();
      return savedCycle;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getLoans() {
    return await this.loanRepository.find({
      relations: ['employee'],
      order: { createdAt: 'DESC' },
    });
  }

  async createLoan(loanData: any) {
    const loan = this.loanRepository.create(loanData);
    return await this.loanRepository.save(loan);
  }

  async getPenalizations() {
    return await this.penalizationRepository.find({
      relations: ['employee'],
      order: { createdAt: 'DESC' },
    });
  }

  async createPenalization(penalData: any) {
    const penal = this.penalizationRepository.create(penalData);
    return await this.penalizationRepository.save(penal);
  }
}
