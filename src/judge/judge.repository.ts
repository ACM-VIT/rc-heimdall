import { EntityRepository, Repository } from 'typeorm';
import { JudgeSubmissions } from './judge.entity';

@EntityRepository(JudgeSubmissions)
export class JudgeRepository extends Repository<JudgeSubmissions> {}
