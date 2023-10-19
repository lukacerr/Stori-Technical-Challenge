import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

export const AdminOnly = () =>
  applyDecorators(ApiBearerAuth(), UseGuards(AuthGuard));
