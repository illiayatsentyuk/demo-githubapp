"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubService = void 0;
const common_1 = require("@nestjs/common");
const github_app_service_1 = require("./github-app.service");
const db_interaction_1 = require("../utils/db.interaction");
let GithubService = class GithubService {
    githubApp;
    constructor(githubApp) {
        this.githubApp = githubApp;
    }
    async getRepoContents(owner, repo, installationId, path = '', ref) {
        const octokit = this.githubApp.getInstallationOctokit(installationId);
        const repositories = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}?ref={ref}', {
            owner,
            repo,
            path,
            ref,
            headers: {
                'X-GitHub-Api-Version': '2026-03-10',
                Accept: 'application/vnd.github.object+json',
            },
        });
        console.log(repositories);
        return repositories;
    }
    async fetchRepoTreeAndFiles(owner, repo, installationId, branch = 'main') {
        const octokit = this.githubApp.getInstallationOctokit(installationId);
        const { data: treeData } = await octokit.request('GET /repos/{owner}/{repo}/git/trees/{tree_sha}', {
            owner,
            repo,
            tree_sha: branch,
            recursive: 'true',
            headers: {
                'X-GitHub-Api-Version': '2026-03-10',
            },
        });
        (0, db_interaction_1.dbInsert)({
            treeData,
        });
        const filesAndFolders = [];
        for (const item of treeData.tree) {
            if (item.type === 'tree') {
                if (item.path.includes('node_modules')) {
                    continue;
                }
                filesAndFolders.push({
                    path: item.path,
                    type: 'folder',
                });
            }
            else if (item.type === 'blob') {
                if (!item.path.endsWith('.ts')) {
                    continue;
                }
                const { data: blob } = await octokit.rest.git.getBlob({
                    owner,
                    repo,
                    file_sha: item.sha,
                });
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
};
exports.GithubService = GithubService;
exports.GithubService = GithubService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [github_app_service_1.GithubAppService])
], GithubService);
//# sourceMappingURL=github.service.js.map