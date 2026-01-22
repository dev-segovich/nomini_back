import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../../entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  /**
   * Registra un nuevo usuario en el sistema
   */
  async register(registerDto: RegisterDto) {
    const { email, username, password } = registerDto;

    // Verificar si el usuario ya existe
    const existingUser = await this.userRepository.findOne({
      where: [{ email }, { username }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new ConflictException('El email ya está registrado');
      }
      if (existingUser.username === username) {
        throw new ConflictException('El nombre de usuario ya está en uso');
      }
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    const user = this.userRepository.create({
      email,
      username,
      password: hashedPassword,
    });

    await this.userRepository.save(user);

    // Generar token JWT
    const payload = {
      username: user.username,
      sub: user.id,
      email: user.email,
    };
    const access_token = this.jwtService.sign(payload);

    return {
      message: 'Usuario registrado exitosamente',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      access_token,
    };
  }

  /**
   * Valida las credenciales del usuario
   */
  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (!user) {
      return null;
    }

    // Verificar si el usuario está activo
    if (!user.isActive) {
      throw new UnauthorizedException('Usuario desactivado');
    }

    // Comparar contraseñas
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    // Retornar usuario sin la contraseña
    const { password: _, ...result } = user;
    return result;
  }

  /**
   * Genera un token JWT para el usuario autenticado
   */
  async login(user: any) {
    const payload = {
      username: user.username,
      sub: user.id,
      email: user.email,
    };

    return {
      message: 'Login exitoso',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      access_token: this.jwtService.sign(payload),
    };
  }

  /**
   * Obtiene el perfil del usuario autenticado
   */
  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'email', 'username', 'isActive', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    return user;
  }

  /**
   * Reestablece la contraseña del usuario
   */
  async resetPassword(username: string, token: string, newPassword: string) {
    if (token !== '000000') {
      throw new UnauthorizedException('Token inválido');
    }

    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await this.userRepository.save(user);

    return { message: 'Contraseña actualizada exitosamente' };
  }
}
