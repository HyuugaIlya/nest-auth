import { Controller, Get, Param, Res } from '@nestjs/common';
import { AppService } from './app.service';
import type { Response } from 'express';
import { ClientIp, UserAgent } from './common/decorators';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get(':code')
  async getLinkByShortCode(
    @Param('code') code: string,
    @Res({ passthrough: true }) res: Response,
    @UserAgent() userAgent: string,
    @ClientIp() ip: string
  ) {
    const { originalUrl } = await this.appService.getLinkByShortCode(code)

    await this.appService.trackClick(code, ip, userAgent)

    return res.redirect(originalUrl)
  }
}
