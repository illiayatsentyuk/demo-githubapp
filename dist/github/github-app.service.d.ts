import { ConfigService } from '@nestjs/config';
export declare class GithubAppService {
    private readonly config;
    private readonly appId;
    private readonly privateKey;
    constructor(config: ConfigService);
    getAppOctokit(): import(".pnpm/@octokit+core@7.0.6/node_modules/@octokit/core", { with: { "resolution-mode": "import" } }).Octokit & {
        paginate: import(".pnpm/@octokit+plugin-paginate-rest@14.0.0_@octokit+core@7.0.6/node_modules/@octokit/plugin-paginate-rest", { with: { "resolution-mode": "import" } }).PaginateInterface;
    } & import(".pnpm/@octokit+plugin-paginate-graphql@6.0.0_@octokit+core@7.0.6/node_modules/@octokit/plugin-paginate-graphql", { with: { "resolution-mode": "import" } }).paginateGraphQLInterface & import(".pnpm/@octokit+plugin-rest-endpoint-methods@17.0.0_@octokit+core@7.0.6/node_modules/@octokit/plugin-rest-endpoint-methods", { with: { "resolution-mode": "import" } }).Api & {
        retry: {
            retryRequest: (error: import("octokit").RequestError, retries: number, retryAfter: number) => import("octokit").RequestError;
        };
    };
    getInstallationOctokit(installationId: number): import(".pnpm/@octokit+core@7.0.6/node_modules/@octokit/core", { with: { "resolution-mode": "import" } }).Octokit & {
        paginate: import(".pnpm/@octokit+plugin-paginate-rest@14.0.0_@octokit+core@7.0.6/node_modules/@octokit/plugin-paginate-rest", { with: { "resolution-mode": "import" } }).PaginateInterface;
    } & import(".pnpm/@octokit+plugin-paginate-graphql@6.0.0_@octokit+core@7.0.6/node_modules/@octokit/plugin-paginate-graphql", { with: { "resolution-mode": "import" } }).paginateGraphQLInterface & import(".pnpm/@octokit+plugin-rest-endpoint-methods@17.0.0_@octokit+core@7.0.6/node_modules/@octokit/plugin-rest-endpoint-methods", { with: { "resolution-mode": "import" } }).Api & {
        retry: {
            retryRequest: (error: import("octokit").RequestError, retries: number, retryAfter: number) => import("octokit").RequestError;
        };
    };
}
