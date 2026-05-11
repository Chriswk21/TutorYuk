import { Test, TestingModule } from '@nestjs/testing';
import { TutorRegistrationController } from './tutor-registration.controller';

describe('TutorRegistrationController', () => {
  let controller: TutorRegistrationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TutorRegistrationController],
    }).compile();

    controller = module.get<TutorRegistrationController>(
      TutorRegistrationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
