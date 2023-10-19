import { Controller, Get } from '@nestjs/common';
import { AdminOnly } from './admin-only.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  @ApiOperation({ summary: 'Empty admin-only endpoint access' })
  @AdminOnly()
  @Get()
  findAll() {
    return true;
  }
}
