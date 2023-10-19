import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { configDotenv } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

export const CONFIG: () => TypeOrmModuleOptions | DataSourceOptions = () => ({
  type: 'mysql',
  autoLoadEntities: true,
  host: process.env.DATABASE_HOST || '0.0.0.0',
  port: Number(process.env.MYSQL_PORT) || 3306,
  username: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '123456',
  database: process.env.MYSQL_DATABASE || 'stori_newsletter',
  entities: ['dist/**/entities/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  migrationsRun: true,
  // synchronize: process.env.NODE_ENV !== 'production',
});

export default function TypeormConfig() {
  return TypeOrmModule.forRoot(CONFIG());
}

// * MIGRATIONS DATASOURCE
configDotenv();
export const connectionSource = new DataSource(CONFIG() as DataSourceOptions);
