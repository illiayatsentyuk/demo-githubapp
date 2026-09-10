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
export declare class WebhookController {
    private readonly githubService;
    constructor(githubService: GithubService);
    handleWebhook(payload: GithubWebhookPayload, event: string, delivery: string): Promise<{
        ok: boolean;
    }>;
}
export {};
