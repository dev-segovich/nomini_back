import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../../entities/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  private saveImage(base64: string): string {
    if (!base64 || !base64.startsWith('data:image')) return base64;

    try {
      const [header, data] = base64.split(',');
      const extension = header.split('/')[1].split(';')[0];
      const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${extension}`;
      const uploadDir = join(process.cwd(), 'uploads');

      if (!existsSync(uploadDir)) {
        mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = join(uploadDir, filename);
      writeFileSync(filePath, data, 'base64');

      return `http://localhost:3456/uploads/${filename}`;
    } catch (error) {
      console.error('Error saving image:', error);
      return base64;
    }
  }

  async create(createEmployeeDto: CreateEmployeeDto) {
    if (createEmployeeDto.avatarUrl) {
      createEmployeeDto.avatarUrl = this.saveImage(createEmployeeDto.avatarUrl);
    }
    const employee = this.employeeRepository.create(createEmployeeDto);
    return await this.employeeRepository.save(employee);
  }

  async findAll() {
    return await this.employeeRepository.find({
      relations: ['department'],
      order: { fullName: 'ASC' },
    });
  }

  async findOne(id: string) {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: ['department'],
    });
    if (!employee) {
      throw new NotFoundException(`Empleado con ID ${id} no encontrado`);
    }
    return employee;
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    if (updateEmployeeDto.avatarUrl) {
      updateEmployeeDto.avatarUrl = this.saveImage(updateEmployeeDto.avatarUrl);
    }
    const employee = await this.findOne(id);
    const updated = this.employeeRepository.merge(employee, updateEmployeeDto);
    return await this.employeeRepository.save(updated);
  }

  async remove(id: string) {
    const employee = await this.findOne(id);
    await this.employeeRepository.remove(employee);
    return { message: 'Empleado eliminado correctamente' };
  }
}
