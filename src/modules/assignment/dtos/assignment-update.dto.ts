import { SubmissionFormatEnum } from '../../../constants';
import {
  DateField,
  EnumField,
  NumberField,
  StringField,
} from '../../../decorators/';

export class UpdateAssignmentDto {
  @StringField()
  title!: string;

  @StringField()
  content!: string;

  @DateField()
  startDate?: Date;

  @DateField()
  dueDate!: Date;

  @NumberField()
  maxScore!: number;

  @EnumField(() => SubmissionFormatEnum)
  submissionFormat!: SubmissionFormatEnum;
}
