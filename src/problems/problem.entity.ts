import { JudgeSubmissions } from 'src/judge/judge.entity';
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Problems Entity
 * @description: structure of the schema to store all details about problems loaded into portal
 */
@Entity()
export class Problems extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** allow storing all details of question via id only */
  @OneToMany(
    () => JudgeSubmissions,
    (submission) => submission.problem,
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
  inputFileURL: string;

  @Column()
  outputFileURL: string;

  @Column()
  instructionsFileURL: string;

  @Column()
  windowsFileURL: string;

  @Column()
  objectFileURL: string;

  @Column()
  inputText: string;

  @Column()
  outputText: string;

  @Column()
  instructionsText: string;
}
