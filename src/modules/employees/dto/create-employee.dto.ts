import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsNotEmpty()
  position: string;

  @IsUUID()
  @IsNotEmpty()
  departmentId: string;

  @IsDateString()
  @IsNotEmpty()
  hireDate: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  baseWeeklySalary?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  weeklyBonus?: number;

  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  paymentFrequency?: string;

  @IsDateString()
  @IsOptional()
  suspensionUntil?: string;
}
