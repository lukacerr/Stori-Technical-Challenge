import { ServeStaticModule } from '@nestjs/serve-static';

export default function StaticConfig() {
  return ServeStaticModule.forRoot({
    rootPath: './public',
    serveRoot: '/public',
  });
}
