
import { NotFoundException } from '@nestjs/common';

export class UserAlreadyCreatedException extends NotFoundException {
  constructor(error?: string) {
    super('error.userAlreadyCreated', error);
  }
}
