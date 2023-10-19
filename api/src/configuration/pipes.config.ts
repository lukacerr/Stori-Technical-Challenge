import { INestApplication, ValidationPipe } from '@nestjs/common';

export default function PipesConfig(app: INestApplication) {
  return app.useGlobalPipes(new ValidationPipe({ transform: true }));
}
