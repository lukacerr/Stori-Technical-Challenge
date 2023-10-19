import { Injectable } from '@nestjs/common';
import { News } from '../entities/news.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { SubscriptionsService } from 'src/subscriptions/subscriptions.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NewsService } from './news.service';

const MAILING_TEMPLATE = (data: News) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.5.0/semantic.min.css"
      integrity="sha512-KXol4x3sVoO+8ZsWPFI/r5KBVB/ssCGB5tsv2nVOKwLg33wTFP3fmnXa47FdSVIshVTgsYk/1734xSk9aFIa4A=="
      crossorigin="anonymous"
      referrerpolicy="no-referrer"
    />
  </head>
  <body>
    <img src="https://www.storicard.com/_next/static/media/complete-logo.0f6b7ce5.svg" alt="Stori" />
    <h1>${data.subject}</h1>
    <span><i>Categories: ${data.categories
      .map((c) => c.name)
      .join(', ')}</i></span>
    <hr />
    <main>${
      data.content.startsWith('<')
        ? data.content
        : `<span>${data.content}</span>`
    }</main>
    <hr />
    <div style="display: flex; gap: 2em">
      <a
        href="${process.env.CLIENT_URL}/news"
        target="_blank"
        >See previous notes</a
      >
      <a
        href="${process.env.CLIENT_URL}/unsubscribe"
        target="_blank"
        >Unsubscribe</a
      >
    </div>
  </body>
</html>
`;

@Injectable()
export class MailingService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly newsService: NewsService,
    private readonly subscriptionsService: SubscriptionsService,
  ) {}

  async sendNew(data: News) {
    const recipients = [
      ...data.extraRecipients,
      ...(await this.subscriptionsService.findRecipientsByCategories(
        data.categories,
        data.extraRecipients,
      )),
    ];

    if (!recipients.length) return;

    return this.mailerService.sendMail({
      to: recipients,
      from: 'noreply@storinewsletter.com',
      subject: data.subject,
      text: data.content,
      html: MAILING_TEMPLATE(data),
      attachments: data.attachments,
    });
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  private async readScheduled() {
    const news = await this.newsService.findScheduledFrom(
      new Date(Date.now() - 30000),
    );

    news.forEach((n) => this.sendNew(n));
  }
}
