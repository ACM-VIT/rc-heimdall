import { Controller, Get } from '@nestjs/common';
import { license, version } from '../package.json';

import { ApiTags } from '@nestjs/swagger';

/**
 * **Application Controller**
 *
 * This controller is for displaying the meta-data for the API. Contains no business logic.
 *
 * @category App
 */
@ApiTags('API')
@Controller('')
export class AppController {
  /**
   * Responds to: _GET(`api/:id`)_
   *
   * Shows application metadata
   */
  @Get('')
  showMetaData() {
    return {
      name: 'Reverse Coding',
      service: 'rc-heimdall',
      version,
      author: {
        name: 'Yash Kumar Verma',
        email: 'yk.verma2000@gmail.com',
        github: 'https://github.com/yashkumarverma/',
      },
      license,
    };
  }
}
