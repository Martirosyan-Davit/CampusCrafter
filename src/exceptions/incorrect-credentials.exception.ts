import { BadRequestException } from '@nestjs/common';

export class IncorrectCredentialsException extends BadRequestException {
  constructor() {
    super('error.incorrectCredentials');
  }
}
