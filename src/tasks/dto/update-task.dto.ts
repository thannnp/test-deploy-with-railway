import { TaskStatus } from './create-task.dto';

export class UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
}
