import { Injectable } from '@nestjs/common';
import type { Octokit } from 'octokit';
import { GithubAppService } from './github-app.service';
import { dbInsert } from 'src/utils/db.interaction';

export type RepoContentsResponse = Awaited<
  ReturnType<Octokit['rest']['repos']['getContent']>
>;

@Injectable()
export class GithubService {
  constructor(private readonly githubApp: GithubAppService) {}

  async getRepoContents(
    owner: string,
    repo: string,
    installationId: number,
    path = '',
    ref?: string,
  ): Promise<RepoContentsResponse> {
    const octokit = this.githubApp.getInstallationOctokit(installationId);

    const repositories = await octokit.request(
      'GET /repos/{owner}/{repo}/contents/{path}?ref={ref}',
      {
        owner,
        repo,
        path,
        ref,
        headers: {
          'X-GitHub-Api-Version': '2026-03-10',
          Accept: 'application/vnd.github.object+json',
        },
      },
    );

    console.log(repositories);

    return repositories as RepoContentsResponse;
  }

  async fetchRepoTreeAndFiles(
    owner: string,
    repo: string,
    installationId: number,
    branch = 'main',
  ): Promise<any[]> {
    const octokit = this.githubApp.getInstallationOctokit(installationId);

    // 1. Fetch the entire tree structure recursively in 1 API call
    // const { data: treeData } = await octokit.rest.git.getTree({
    //   owner,
    //   repo,
    //   tree_sha: branch,
    //   recursive: 'true', // Recursively gets all subfolders and files
    // });

    const { data: treeData } = await octokit.request(
      'GET /repos/{owner}/{repo}/git/trees/{tree_sha}',
      {
        owner,
        repo,
        tree_sha: branch,
        recursive: 'true',
        headers: {
          'X-GitHub-Api-Version': '2026-03-10',
        },
      },
    );
    dbInsert({
      treeData,
    });

    const filesAndFolders: any[] = [];

    // 2. Iterate through all items in the repo
    for (const item of treeData.tree) {
      if (item.type === 'tree') {
        if (item.path.includes('node_modules')) {
          continue;
        }
        // It's a folder
        filesAndFolders.push({
          path: item.path,
          type: 'folder',
        });
      } else if (item.type === 'blob') {
        if (!item.path.endsWith('.ts')) {
          continue;
        }
        // It's a file — fetch its content using its SHA
        const { data: blob } = await octokit.rest.git.getBlob({
          owner,
          repo,
          file_sha: item.sha,
        });

        // Decode file content (blobs are Base64 encoded)
        const content = Buffer.from(blob.content, 'base64').toString('utf-8');

        filesAndFolders.push({
          path: item.path,
          type: 'file',
          size: item.size,
          content: content,
        });
      }
    }

    return filesAndFolders;
  }
}
