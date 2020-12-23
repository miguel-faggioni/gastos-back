import { EntityRepository, Repository } from 'typeorm';
import { JobsToRun } from '../models/Jobs_to_run.model';

@EntityRepository(JobsToRun)
export class JobsToRunRepository extends Repository<JobsToRun> {

}
