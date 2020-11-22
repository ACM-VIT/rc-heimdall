import { EntityRepository, Repository } from 'typeorm';
import { GetQuestionDto } from './dto/filter-question.dto';
import { QuestionEntity } from './question.entity';

@EntityRepository(QuestionEntity)
export class QuestionRepository extends Repository<QuestionEntity> {
  /**
   * Method to clear list of stored Question IDs
   * @async
   * @returns boolean true if all questions from persistence later were cleared
   */
  async clearStorage(): Promise<boolean> {
    try {
      await this.delete(1);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Method to seed question into persistence layer
   * @async
   * @param questionList array of strings containing ids of questions downloaded by controller
   * @returns boolean true if seeding is successful
   */
  async seedQuestionList(questionList: Array<string>): Promise<boolean> {
    try {
      const insertionObject = questionList.map(question => {
        return { id: question };
      });
      await this.createQueryBuilder()
        .insert()
        .into(QuestionEntity)
        .values(insertionObject)
        .execute();

      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * method to check if given question id exists in storage
   * @async
   * @param filterDto {id} object containing the ID of the question to check if it exists
   * @returns boolean true if given question with id exists
   */
  async checkIfQuestionExist(filterDto: GetQuestionDto): Promise<boolean> {
    const { id } = filterDto;
    const query = this.createQueryBuilder('questions');
    query.andWhere('questions.id = :id', { id });
    const result = await query.getMany();
    return result.length !== 0;
  }
}
