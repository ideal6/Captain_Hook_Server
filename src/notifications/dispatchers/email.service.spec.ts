import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { NotificationMethod } from '../entities/notification-method.entity';
import { EmailService } from './email.service';

describe('EmailService', () => {
  let service: EmailService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.development.env',
        }),
      ],
      providers: [EmailService],
    }).compile();

    service = module.get<EmailService>(EmailService);
    await service.onModuleInit();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send mail', async () => {
    await service.dispatch({
      notification: {
        name: '알림 예시',
      },
      key: 'wjdtmddnr24@naver.com',
    } as NotificationMethod);
  });
});
