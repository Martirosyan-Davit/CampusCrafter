import {
  DateField,
  NumberField,
  StringField,
  UUIDField,
} from '../../../decorators';

export class GradeCreateDto {
  @UUIDField()
  studentId!: Uuid;

  @UUIDField()
  assignmentId!: Uuid;

  @NumberField()
  score!: number;

  @StringField()
  feedback!: string;

  @DateField()
  submissionDate!: Date;
}
