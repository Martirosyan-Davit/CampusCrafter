import { AbstractDto } from '../../../common/dto/abstract.dto';
import { DateField, NumberField, StringField } from '../../../decorators';
import { type AssignmentEntity } from '../assignment.entity';

export class AssignmentDto extends AbstractDto {
  @StringField()
  title!: string;

  @StringField()
  content!: string;

  @DateField()
  dueDate!: Date;

  @NumberField()
  maxScore!: number;

  constructor(assignment: AssignmentEntity) {
    super(assignment);
    this.title = assignment.title;
    this.content = assignment.content;
    this.dueDate = assignment.dueDate;
    this.maxScore = assignment.maxScore;
  }
}
