import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from '../../entities/department.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto, userId: string) {
    const { name } = createDepartmentDto;

    const existing = await this.departmentRepository.findOne({
      where: { name, userId },
    });
    if (existing) {
      throw new ConflictException('El departamento ya existe para su cuenta');
    }

    const department = this.departmentRepository.create({ name, userId });
    return await this.departmentRepository.save(department);
  }

  async findAll(userId: string) {
    return await this.departmentRepository.find({
      where: { userId },
      order: { name: 'ASC' },
    });
  }

  async remove(id: string, userId: string) {
    const department = await this.departmentRepository.findOne({
      where: { id, userId },
    });
    if (!department) {
      throw new NotFoundException('Departamento no encontrado');
    }
    await this.departmentRepository.remove(department);
    return { message: 'Departamento eliminado correctamente' };
  }
}
