import { AbstractDto } from '../../../common/dto/abstract.dto';
import { DateField, NumberField, StringField } from '../../../decorators';
import { type GradeEntity } from '../grade.entity';

export class GradeDto extends AbstractDto {
  //   @UUIDField()
  //   studentId!: Uuid;     /* FIX these if a need to use */

  //   @UUIDField()
  //   assignmentId!: Uuid;

  @NumberField()
  score!: number;

  @StringField()
  feedback!: string;

  @DateField()
  submissionDate!: Date;

  constructor(grade: GradeEntity) {
    super(grade);
    // this.studentId = grade.studentId;
    // this.assignmentId = grade.assignmentId;
    this.score = grade.score;
    this.feedback = grade.feedback;
    this.submissionDate = grade.submissionDate;
  }
}
