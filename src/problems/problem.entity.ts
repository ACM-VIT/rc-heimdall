import { JudgeSubmissions } from 'src/judge/judge.entity';
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Problems extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** allow storing all details of question via id only */
  @OneToMany(
    () => JudgeSubmissions,
    submission => submission.problem,
    {
      eager: true,
    },
  )
  submissions: JudgeSubmissions[];

  @Column()
  name: string;

  @Column({
    default: 100,
  })
  maxPoints: number;

  @Column()
  inputFileLocation: string;

  @Column()
  outputFileLocation: string;

  @Column()
  exeFileURL: string;

  @Column()
  oFileURL: string;
}
