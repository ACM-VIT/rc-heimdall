import { EntityRepository, Repository } from 'typeorm';
import { QuestionEntity } from './entities/question.entity';

@EntityRepository(QuestionEntity)
export class QuestionRepository extends Repository<QuestionEntity> {
  async clearStorage(): Promise<boolean> {
    try {
      await this.delete(1);
      return true;
    } catch (error) {
      return false;
    }
  }

  async seedQuestionList(questionList: Array<string>): Promise<Array<{ id }>> {
    try {
      const insertionObject = questionList.map(question => {
        return { id: question };
      });
      await this.createQueryBuilder()
        .insert()
        .into(QuestionEntity)
        .values(insertionObject)
        .execute();

      return insertionObject;
    } catch (error) {
      return [];
    }
  }
}
