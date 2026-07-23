import { Injectable, NotFoundException } from '@nestjs/common';
import { dbFindOne } from './utils/db.interaction';
import { GithubService, RepoContentsResponse } from './github/github.service';

@Injectable()
export class AppService {
  constructor(private readonly githubService: GithubService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getTask(_id: string, owner: string): Promise<RepoContentsResponse> {
    const userInstallation = dbFindOne({ owner });

    if (!userInstallation) {
      throw new NotFoundException(`Installation not found for owner: ${owner}`);
    }

    const payload = userInstallation.payload as {
      repositories?: { name: string }[];
    };
    const repo = payload.repositories?.[0]?.name;
    const installationId = userInstallation.installationId as number;

    if (!repo) {
      throw new NotFoundException(`Repository not found for owner: ${owner}`);
    }

    return this.githubService.getRepoContents(
      owner,
      repo,
      installationId,
      `test-${_id}`,
      'main',
    );
  }

  async getRepoTree(_id: string, owner: string): Promise<any> {
    const userInstallation = dbFindOne({ owner });

    if (!userInstallation) {
      throw new NotFoundException(`Installation not found for owner: ${owner}`);
    }

    const payload = userInstallation.payload as {
      repositories?: { name: string }[];
    };
    const repo = payload.repositories?.[0]?.name;
    const installationId = userInstallation.installationId as number;

    if (!repo) {
      throw new NotFoundException(`Repository not found for owner: ${owner}`);
    }

    const tree = await this.githubService.fetchRepoTreeAndFiles(
      owner,
      repo,
      installationId,
    );
    return tree;
  }
}
