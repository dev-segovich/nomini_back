import { Controller, Get, Post, Body } from '@nestjs/common';
import { PayrollService } from './payroll.service';

@Controller('payroll')
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Get()
  async findAll() {
    return await this.payrollService.findAll();
  }

  @Post()
  async create(@Body() createDto: any) {
    return await this.payrollService.create(createDto);
  }

  @Get('loans')
  async getLoans() {
    return await this.payrollService.getLoans();
  }

  @Post('loans')
  async createLoan(@Body() loanData: any) {
    return await this.payrollService.createLoan(loanData);
  }

  @Get('penalizations')
  async getPenalizations() {
    return await this.payrollService.getPenalizations();
  }

  @Post('penalizations')
  async createPenalization(@Body() penalData: any) {
    return await this.payrollService.createPenalization(penalData);
  }
}
