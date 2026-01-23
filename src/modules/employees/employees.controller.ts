import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('employees')
@UseGuards(JwtAuthGuard)
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto, @Req() req) {
    return this.employeesService.create(createEmployeeDto, req.user.sub);
  }

  @Get()
  findAll(@Req() req) {
    return this.employeesService.findAll(req.user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.employeesService.findOne(id, req.user.sub);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
    @Req() req,
  ) {
    return this.employeesService.update(id, updateEmployeeDto, req.user.sub);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.employeesService.remove(id, req.user.sub);
  }
}
