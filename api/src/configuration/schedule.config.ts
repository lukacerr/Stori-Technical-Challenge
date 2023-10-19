import { ScheduleModule } from '@nestjs/schedule';

export default function ScheduleConfig() {
  return ScheduleModule.forRoot();
}
