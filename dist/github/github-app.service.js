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
exports.GithubAppService = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const octokit_1 = require("octokit");
const auth_app_1 = require("@octokit/auth-app");
let GithubAppService = class GithubAppService {
    config;
    appId;
    privateKey;
    constructor(config) {
        this.config = config;
        this.appId = Number(this.config.get('GITHUB_APP_ID'));
        const keyPath = this.config.get('GITHUB_PRIVATE_KEY');
        if (!keyPath) {
            throw new Error('GITHUB_PRIVATE_KEY env variable is not set');
        }
        this.privateKey = (0, fs_1.readFileSync)((0, path_1.resolve)(keyPath), 'utf8');
    }
    getAppOctokit() {
        return new octokit_1.Octokit({
            authStrategy: auth_app_1.createAppAuth,
            auth: {
                appId: this.appId,
                privateKey: this.privateKey,
            },
        });
    }
    getInstallationOctokit(installationId) {
        return new octokit_1.Octokit({
            authStrategy: auth_app_1.createAppAuth,
            auth: {
                appId: this.appId,
                privateKey: this.privateKey,
                installationId,
            },
        });
    }
};
exports.GithubAppService = GithubAppService;
exports.GithubAppService = GithubAppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GithubAppService);
//# sourceMappingURL=github-app.service.js.map