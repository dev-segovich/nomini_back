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

  async create(createDepartmentDto: CreateDepartmentDto) {
    const { name } = createDepartmentDto;

    const existing = await this.departmentRepository.findOne({
      where: { name },
    });
    if (existing) {
      throw new ConflictException('El departamento ya existe');
    }

    const department = this.departmentRepository.create({ name });
    return await this.departmentRepository.save(department);
  }

  async findAll() {
    return await this.departmentRepository.find({
      order: { name: 'ASC' },
    });
  }

  async remove(id: string) {
    const department = await this.departmentRepository.findOne({
      where: { id },
    });
    if (!department) {
      throw new NotFoundException('Departamento no encontrado');
    }
    await this.departmentRepository.remove(department);
    return { message: 'Departamento eliminado correctamente' };
  }
}
