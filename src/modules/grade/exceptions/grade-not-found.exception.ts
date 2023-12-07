import { NotFoundException } from '@nestjs/common';

export class GradeNotFoundException extends NotFoundException {
  constructor(error?: string) {
    super('error.gradeNotFound', error);
  }
}
