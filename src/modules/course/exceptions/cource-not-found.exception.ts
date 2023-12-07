import { NotFoundException } from '@nestjs/common';

export class CourseNotFoundException extends NotFoundException {
  constructor(error?: string) {
    super('error.courseNotFound', error);
  }
}
