import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { PayrollCycle } from '../../entities/payroll-cycle.entity';
import { PayrollSummary } from '../../entities/payroll-summary.entity';
import { Loan } from '../../entities/loan.entity';
import { Penalization } from '../../entities/penalization.entity';
import { Employee } from '../../entities/employee.entity';
import { MailService } from '../mail/mail.service';
import { PdfService } from '../pdf/pdf.service';

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
    private readonly mailService: MailService,
    private readonly pdfService: PdfService,
  ) {}

  async findAll(userId: string) {
    return await this.cycleRepository.find({
      where: { userId },
      relations: ['summaries'],
      order: { createdAt: 'DESC' },
    });
  }

  async create(createDto: any, userId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { summaries, updatedLoans, updatedPenalizations, ...cycleData } =
        createDto;

      // Save the cycle
      const cycle = this.cycleRepository.create({
        ...cycleData,
        userId,
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
      savedCycle.summaries = summaryEntities;

      // Update loans if provided
      if (updatedLoans && Array.isArray(updatedLoans)) {
        for (const l of updatedLoans) {
          // Verify loan belongs to user
          const loan = await this.loanRepository.findOne({
            where: { id: l.id, userId },
          });
          if (loan) {
            await queryRunner.manager.update(Loan, l.id, {
              remainingWeeks: l.remainingWeeks,
              status: l.status,
            });
          }
        }
      }

      // Update penalizations if provided
      if (updatedPenalizations && Array.isArray(updatedPenalizations)) {
        for (const p of updatedPenalizations) {
          // Verify penalization belongs to user
          const penal = await this.penalizationRepository.findOne({
            where: { id: p.id, userId },
          });
          if (penal) {
            await queryRunner.manager.update(Penalization, p.id, {
              remainingWeeks: p.remainingWeeks,
              status: p.status,
            });
          }
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

  async getLoans(userId: string) {
    return await this.loanRepository.find({
      where: { userId },
      relations: ['employee'],
      order: { createdAt: 'DESC' },
    });
  }

  async createLoan(loanData: any, userId: string) {
    // Optional: Verify employee belongs to user
    const employee = await this.employeeRepository.findOne({
      where: { id: loanData.employeeId, userId },
    });
    if (!employee)
      throw new NotFoundException('Empleado no encontrado en su cuenta');

    const loan = this.loanRepository.create({ ...loanData, userId });
    const savedLoan = (await this.loanRepository.save(loan)) as unknown as Loan;

    // Send email with PDF
    try {
      if (employee.email) {
        const pdf = await this.pdfService.generateReceipt({
          title: 'Comprobante de Préstamo',
          type: 'loan',
          employeeName: employee.fullName,
          amount: savedLoan.amount,
          totalWeeks: savedLoan.totalWeeks,
          weeklyInstallment: savedLoan.weeklyInstallment,
          notes: savedLoan.notes,
        });

        await this.mailService.sendMailWithAttachment(
          employee.email,
          'Nuevo Préstamo Registrado - Nomini',
          `Hola ${employee.fullName}, se ha registrado un nuevo préstamo por un monto de $${savedLoan.amount}. Adjunto encontrarás el comprobante.`,
          `comprobante_prestamo_${savedLoan.id.split('-')[0]}.pdf`,
          pdf,
        );
      }
    } catch (error) {
      console.error('Error in post-loan creation email process:', error);
    }

    return savedLoan;
  }

  async getPenalizations(userId: string) {
    return await this.penalizationRepository.find({
      where: { userId },
      relations: ['employee'],
      order: { createdAt: 'DESC' },
    });
  }

  async createPenalization(penalData: any, userId: string) {
    // Optional: Verify employee belongs to user
    const employee = await this.employeeRepository.findOne({
      where: { id: penalData.employeeId, userId },
    });
    if (!employee)
      throw new NotFoundException('Empleado no encontrado en su cuenta');

    const penal = this.penalizationRepository.create({ ...penalData, userId });
    const savedPenal = (await this.penalizationRepository.save(penal)) as unknown as Penalization;

    // Send email with PDF
    try {
      if (employee.email) {
        const pdf = await this.pdfService.generateReceipt({
          title: 'Comprobante de Penalización',
          type: 'penalization',
          employeeName: employee.fullName,
          amount: savedPenal.amount,
          category: savedPenal.category,
          reason: savedPenal.reason,
          totalWeeks: savedPenal.totalWeeks,
          weeklyInstallment: savedPenal.weeklyInstallment,
        });

        await this.mailService.sendMailWithAttachment(
          employee.email,
          'Nueva Penalización Registrada - Nomini',
          `Hola ${employee.fullName}, se ha registrado una nueva penalización por un monto de $${savedPenal.amount}. Adjunto encontrarás el comprobante.`,
          `comprobante_penalizacion_${savedPenal.id.split('-')[0]}.pdf`,
          pdf,
        );
      }
    } catch (error) {
      console.error('Error in post-penalization creation email process:', error);
    }

    return savedPenal;
  }
}
