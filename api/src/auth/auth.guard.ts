import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  private adminPassword: string;

  constructor(private reflector: Reflector) {
    this.adminPassword = process.env.ADMIN_PASSWORD || '123456';
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (
      this.extractTokenFromHeader(context.switchToHttp().getRequest()) !==
      this.adminPassword
    )
      throw new UnauthorizedException();

    return true;
  }
}
