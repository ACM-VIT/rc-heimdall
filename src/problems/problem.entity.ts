import { JudgeSubmissions } from 'src/judge/judge.entity';
import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Problem extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  /** allow storing all details of question via id only */
  @OneToMany(
    () => JudgeSubmissions,
    submission => submission.problemID,
    {
      eager: true,
    },
  )
  submissions: JudgeSubmissions[];

  @Column({
    default: 100,
  })
  maxPoints: number;

  @Column()
  inputFileLocation: string;

  @Column()
  outputFileLocation: string;

  @Column()
  binaryFileLocation: string;
}
