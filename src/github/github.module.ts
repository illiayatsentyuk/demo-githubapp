import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GithubWebhooksModule } from '@dev-thought/nestjs-github-webhooks';
import { WebhookController } from './github.controller';
import { GithubService } from './github.service';
import { GithubAppService } from './github-app.service';

@Module({
  imports: [
    GithubWebhooksModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        webhookSecret: config.getOrThrow<string>('GITHUB_WEBHOOK_SECRET'),
      }),
    }),
  ],
  controllers: [WebhookController],
  providers: [GithubService, GithubAppService],
  exports: [GithubAppService, GithubService],
})
export class GithubModule {}
