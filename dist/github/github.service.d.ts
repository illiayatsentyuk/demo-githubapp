import type { Octokit } from 'octokit';
import { GithubAppService } from './github-app.service';
export type RepoContentsResponse = Awaited<ReturnType<Octokit['rest']['repos']['getContent']>>;
export declare class GithubService {
    private readonly githubApp;
    constructor(githubApp: GithubAppService);
    getRepoContents(owner: string, repo: string, installationId: number, path?: string, ref?: string): Promise<RepoContentsResponse>;
    fetchRepoTreeAndFiles(owner: string, repo: string, installationId: number, branch?: string): Promise<any[]>;
}
