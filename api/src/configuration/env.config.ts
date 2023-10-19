import { ConfigModule } from '@nestjs/config';

export default function EnvConfig() {
  return ConfigModule.forRoot();
}
