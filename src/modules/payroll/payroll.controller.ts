import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('payroll')
@UseGuards(JwtAuthGuard)
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Get()
  async findAll(@Req() req) {
    return await this.payrollService.findAll(req.user.sub);
  }

  @Post()
  async create(@Body() createDto: any, @Req() req) {
    return await this.payrollService.create(createDto, req.user.sub);
  }

  @Get('loans')
  async getLoans(@Req() req) {
    return await this.payrollService.getLoans(req.user.sub);
  }

  @Post('loans')
  async createLoan(@Body() loanData: any, @Req() req) {
    return await this.payrollService.createLoan(loanData, req.user.sub);
  }

  @Get('penalizations')
  async getPenalizations(@Req() req) {
    return await this.payrollService.getPenalizations(req.user.sub);
  }

  @Post('penalizations')
  async createPenalization(@Body() penalData: any, @Req() req) {
    return await this.payrollService.createPenalization(
      penalData,
      req.user.sub,
    );
  }
}
