import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export default function SwaggerConfig(app: INestApplication) {
  if (process.env.NODE_ENV === 'production') return;

  return SwaggerModule.setup(
    'docs',
    app,
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('Stori Newsletter API')
        .addBearerAuth()
        .build(),
    ),
  );
}
