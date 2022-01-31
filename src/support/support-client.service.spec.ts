import { Test, TestingModule } from '@nestjs/testing';
import { SupportClientService } from './support-client.service';

describe('SupportClient.ServiceService', () => {
  let service: SupportClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SupportClientService],
    }).compile();

    service = module.get<SupportClientService>(SupportClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
