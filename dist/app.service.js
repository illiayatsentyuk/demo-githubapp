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
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const db_interaction_1 = require("./utils/db.interaction");
const github_service_1 = require("./github/github.service");
let AppService = class AppService {
    githubService;
    constructor(githubService) {
        this.githubService = githubService;
    }
    getHello() {
        return 'Hello World!';
    }
    async getTask(_id, owner) {
        const userInstallation = (0, db_interaction_1.dbFindOne)({ owner });
        if (!userInstallation) {
            throw new common_1.NotFoundException(`Installation not found for owner: ${owner}`);
        }
        const payload = userInstallation.payload;
        const repo = payload.repositories?.[0]?.name;
        const installationId = userInstallation.installationId;
        if (!repo) {
            throw new common_1.NotFoundException(`Repository not found for owner: ${owner}`);
        }
        return this.githubService.getRepoContents(owner, repo, installationId, `test-${_id}`, 'main');
    }
    async getRepoTree(_id, owner) {
        const userInstallation = (0, db_interaction_1.dbFindOne)({ owner });
        if (!userInstallation) {
            throw new common_1.NotFoundException(`Installation not found for owner: ${owner}`);
        }
        const payload = userInstallation.payload;
        const repo = payload.repositories?.[0]?.name;
        const installationId = userInstallation.installationId;
        if (!repo) {
            throw new common_1.NotFoundException(`Repository not found for owner: ${owner}`);
        }
        const tree = await this.githubService.fetchRepoTreeAndFiles(owner, repo, installationId);
        return tree;
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [github_service_1.GithubService])
], AppService);
//# sourceMappingURL=app.service.js.map