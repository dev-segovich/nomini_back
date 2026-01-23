import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('departments')
@UseGuards(JwtAuthGuard)
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Post()
  create(@Body() createDepartmentDto: CreateDepartmentDto, @Req() req) {
    return this.departmentsService.create(createDepartmentDto, req.user.sub);
  }

  @Get()
  findAll(@Req() req) {
    return this.departmentsService.findAll(req.user.sub);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.departmentsService.remove(id, req.user.sub);
  }
}
