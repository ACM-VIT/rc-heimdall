import { BaseEntity, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class QuestionEntity extends BaseEntity {
  @PrimaryColumn()
  id: string;
}
