import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DevConfigService } from './common/providers/DevConfigService';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: DevConfigService,
          useValue: {
            getDBHost: jest.fn().mockReturnValue('mocked-db-host'),
          },
        },
        {
          provide: 'CONFIG',
          useValue: { port: '3000' },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe(
        'Hello im learning nestJs fundamental mocked-db-host PORT = 3000',
      );
    });
  });
});
