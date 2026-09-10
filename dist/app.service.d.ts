import { GithubService, RepoContentsResponse } from './github/github.service';
export declare class AppService {
    private readonly githubService;
    constructor(githubService: GithubService);
    getHello(): string;
    getTask(_id: string, owner: string): Promise<RepoContentsResponse>;
    getRepoTree(_id: string, owner: string): Promise<any>;
}
