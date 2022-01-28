import { Test, TestingModule } from '@nestjs/testing';
import { SupportClient.ServiceService } from './support-client.service.service';

describe('SupportClient.ServiceService', () => {
  let service: SupportClient.ServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SupportClient.ServiceService],
    }).compile();

    service = module.get<SupportClient.ServiceService>(SupportClient.ServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
