import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class SsrController {
  @Get()
  @Render('index')
  home(): unknown {
    return {};
  }
}
