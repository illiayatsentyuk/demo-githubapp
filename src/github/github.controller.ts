import { Controller, Post, Body, Headers, UseGuards } from '@nestjs/common';
import { GithubGuard } from '@dev-thought/nestjs-github-webhooks';
import { dbInsert } from '../utils/db.interaction';
import { GithubService } from './github.service';

interface GithubWebhookPayload {
  [x: string]: any;
  installation?: {
    id: number;
  };
  sender?: {
    login: string;
  };
  repositories?: {
    name: string;
  }[];
  action?: string;
}

@Controller('github')
export class WebhookController {
  constructor(private readonly githubService: GithubService) {}

  // Generic handler for all events
  @UseGuards(GithubGuard)
  @Post('webhook')
  async handleWebhook(
    @Body() payload: GithubWebhookPayload,
    @Headers('x-github-event') event: string,
    @Headers('x-github-delivery') delivery: string,
  ) {
    console.log(payload);
    console.log(event);
    console.log(delivery);

    // Example: extract installation ID
    const installationId = payload.installation?.id;
    if (!installationId) {
      // some events (like marketplaces) don't include installation
      return { ok: true };
    }

    // Skip API calls when the installation no longer exists / was revoked
    if (payload.action === 'deleted' || payload.action === 'suspend') {
      return { ok: true };
    }

    const login = payload.sender?.login;
    if (!login) {
      return { ok: true };
    }

    const repo = payload.repositories?.[0]?.name;
    if (!repo) {
      return { ok: true };
    }

    const data = await this.githubService.getRepoContents(
      login,
      repo,
      installationId,
      '',
      'main',
    );

    dbInsert({
      event,
      delivery,
      installationId,
      payload,
      data,
    });

    return { ok: true };
  }
}
