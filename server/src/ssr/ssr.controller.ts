import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class SsrController {
  @Get('')
  @Render('index')
  home(): unknown {
    return {};
  }

  @Get('login')
  @Render('login')
  login(): unknown {
    return {};
  }

  // @Get('test')
  // @Render('test')
  // test(): unknown {
  //   return {};
  // }
}
