import { BaseEntity, PrimaryColumn } from 'typeorm';

export class QuestionEntity extends BaseEntity {
  @PrimaryColumn()
  id: string;
}
