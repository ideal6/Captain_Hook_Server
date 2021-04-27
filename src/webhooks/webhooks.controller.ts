import { Controller, Get } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { WebhooksService } from './webhooks.service';
@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Get('/webhook/uniqueId')
  async uniqueId(): Promise<string> {
    while (true) {
      const uuid = uuidv4();
      if (await this.webhooksService.fineOne(uuid)) {
        continue;
      }
      return uuid;
    }
  }
}
