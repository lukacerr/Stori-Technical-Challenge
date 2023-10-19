import { MailerModule } from '@nestjs-modules/mailer';

export default function MailerConfig() {
  return MailerModule.forRoot({
    transport: {
      host: 'smtp.freesmtpservers.com',
      port: 25,
      secure: false,
    },
    defaults: {
      from: 'Stori Newsletter',
    },
  });
}
