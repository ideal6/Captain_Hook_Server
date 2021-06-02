import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Discord from 'discord.js';
@Injectable()
export class DiscordService implements IDispatcher {
  private readonly client: Discord.Client;

  constructor(private readonly configService: ConfigService) {
    this.client = new Discord.Client();
    this.client.on('message', (msg) => {
      if (msg.content.startsWith('/subscribe')) this.subscribe(msg);
      else if (msg.content.startsWith('/unsubscribe')) this.unsubscribe(msg);
    });
    this.client.login(configService.get<string>('DISCORD_BOT_TOKEN'));
  }

  subscribe(msg: Discord.Message) {
    throw new Error('Method not implemented.');
  }
  unsubscribe(msg: Discord.Message) {
    throw new Error('Method not implemented.');
  }
  dispatch() {
    throw new Error('Method not implemented.');
  }
}
