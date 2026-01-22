import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  position: string;

  @IsUUID()
  @IsNotEmpty()
  departmentId: string;

  @IsDateString()
  @IsNotEmpty()
  hireDate: string;

  @IsNumber()
  @IsOptional()
  baseWeeklySalary?: number;

  @IsNumber()
  @IsOptional()
  weeklyBonus?: number;

  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @IsString()
  @IsOptional()
  status?: string;
}
