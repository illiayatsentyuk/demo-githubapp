import { readFileSync } from 'fs';
import { resolve } from 'path';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Octokit } from 'octokit';
import { createAppAuth } from '@octokit/auth-app';

@Injectable()
export class GithubAppService {
  private readonly appId: number;
  private readonly privateKey: string;

  constructor(private readonly config: ConfigService) {
    this.appId = Number(this.config.get<string>('GITHUB_APP_ID'));

    const keyPath = this.config.get<string>('GITHUB_PRIVATE_KEY');
    if (!keyPath) {
      throw new Error('GITHUB_PRIVATE_KEY env variable is not set');
    }

    this.privateKey = readFileSync(resolve(keyPath), 'utf8');
  }

  /**
   * Create an Octokit client authenticated as the GitHub App itself.
   */
  getAppOctokit() {
    return new Octokit({
      authStrategy: createAppAuth,
      auth: {
        appId: this.appId,
        privateKey: this.privateKey,
      },
    });
  }

  /**
   * Create an Octokit client authenticated as a specific installation.
   * You usually get installationId from webhook payload.
   */
  getInstallationOctokit(installationId: number) {
    return new Octokit({
      authStrategy: createAppAuth,
      auth: {
        appId: this.appId,
        privateKey: this.privateKey,
        installationId,
      },
    });
  }
}
