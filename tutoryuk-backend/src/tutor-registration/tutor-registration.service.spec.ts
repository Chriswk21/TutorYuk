import { Test, TestingModule } from '@nestjs/testing';
import { TutorRegistrationService } from './tutor-registration.service';

describe('TutorRegistrationService', () => {
  let service: TutorRegistrationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TutorRegistrationService],
    }).compile();

    service = module.get<TutorRegistrationService>(TutorRegistrationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
