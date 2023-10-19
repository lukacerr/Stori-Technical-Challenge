import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import PipesConfig from './configuration/pipes.config';
import CorsConfig from './configuration/cors.config';
import SwaggerConfig from './configuration/swagger.config';

(async () => {
  const app = await NestFactory.create(AppModule);
  PipesConfig(app);
  CorsConfig(app);
  SwaggerConfig(app);
  await app.listen(process.env.PORT || 5000);
})();
