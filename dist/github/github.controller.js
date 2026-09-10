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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookController = void 0;
const common_1 = require("@nestjs/common");
const nestjs_github_webhooks_1 = require("@dev-thought/nestjs-github-webhooks");
const db_interaction_1 = require("../utils/db.interaction");
const github_service_1 = require("./github.service");
let WebhookController = class WebhookController {
    githubService;
    constructor(githubService) {
        this.githubService = githubService;
    }
    async handleWebhook(payload, event, delivery) {
        console.log(payload);
        console.log(event);
        console.log(delivery);
        const installationId = payload.installation?.id;
        if (!installationId) {
            return { ok: true };
        }
        if (payload.action === 'deleted' || payload.action === 'suspend') {
            return { ok: true };
        }
        const login = payload.sender?.login;
        if (!login) {
            return { ok: true };
        }
        const repo = payload.repositories?.[0]?.name;
        if (!repo) {
            return { ok: true };
        }
        const data = await this.githubService.getRepoContents(login, repo, installationId, '', 'main');
        (0, db_interaction_1.dbInsert)({
            event,
            delivery,
            installationId,
            payload,
            data,
        });
        return { ok: true };
    }
};
exports.WebhookController = WebhookController;
__decorate([
    (0, common_1.UseGuards)(nestjs_github_webhooks_1.GithubGuard),
    (0, common_1.Post)('webhook'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('x-github-event')),
    __param(2, (0, common_1.Headers)('x-github-delivery')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], WebhookController.prototype, "handleWebhook", null);
exports.WebhookController = WebhookController = __decorate([
    (0, common_1.Controller)('github'),
    __metadata("design:paramtypes", [github_service_1.GithubService])
], WebhookController);
//# sourceMappingURL=github.controller.js.map