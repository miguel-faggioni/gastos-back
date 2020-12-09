import { EntityRepository, Repository } from 'typeorm';
import { Feedback } from '../models/Feedback.model';

@EntityRepository(Feedback)
export class FeedbackRepository extends Repository<Feedback> {

  public bulkCreate(Feedbacks: Feedback[]): Promise<any> {
    return this.manager.createQueryBuilder().insert().into(Feedback).values(Feedbacks).execute();
  }

  public async removeById(id: number): Promise<Feedback> {
    const itemToRemove: Feedback = await this.findOne({id});
    return this.manager.remove(itemToRemove);
  }

  public findByText(text: string): Promise<Feedback[]> {
    return this.manager.find(Feedback, {where: {text}});
  }

  public findOneById(id: number): Promise<Feedback> {
    return this.manager.findOne(Feedback, {where: {id}});
  }

}
