import { getCustomRepository, Repository } from 'typeorm';
import { Feedback } from '../models/Feedback.model';
import { FeedbackRepository } from '../repository/Feedback.repository';

export class FeedbackService {

  public static bulkCreate(Feedbacks: Feedback[]): Promise<Feedback[]> {
    return getCustomRepository(FeedbackRepository).bulkCreate(Feedbacks);
  }

  public static findOneBy(whereClause: any, options?: any): Promise<Feedback> {
    const opts = Object.assign({}, options, { where: whereClause });
    return getCustomRepository(FeedbackRepository).findOne(opts);
  }

  public static findManyBy(whereClause: any, options?: any): Promise<Feedback[]> {
    const opts = Object.assign({}, options, { where: whereClause });
    return getCustomRepository(FeedbackRepository).find(opts);
  }

  public static remove(feedback: Feedback): Promise<Feedback> {
    return getCustomRepository(FeedbackRepository).remove(feedback);
  }

  public static removeById(id: number): Promise<Feedback> {
    return getCustomRepository(FeedbackRepository).removeById(id);
  }

  public static save(feedback: Feedback): Promise<Feedback> {
    return getCustomRepository(FeedbackRepository).save(feedback);
  }

}
