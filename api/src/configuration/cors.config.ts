import { INestApplication } from '@nestjs/common';

export default function CorsConfig(app: INestApplication) {
  return app.enableCors();
}
