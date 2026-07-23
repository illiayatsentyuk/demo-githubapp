import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { RepoContentsResponse } from './github/github.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('task/:id')
  getTask(@Param('id') id: string): Promise<RepoContentsResponse> {
    return this.appService.getTask(id, 'illiayatsentyuk');
  }

  @Get('repo-tree/:id')
  getRepoTree(@Param('id') id: string): Promise<any> {
    return this.appService.getRepoTree(id, 'illiayatsentyuk');
  }
}
