import { AppService } from './app.service';
import { RepoContentsResponse } from './github/github.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    getTask(id: string): Promise<RepoContentsResponse>;
    getRepoTree(id: string): Promise<any>;
}
