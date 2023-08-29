import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from './schemas/task.schema';
import { Model } from 'mongoose';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const createdTask = await this.taskModel.create(createTaskDto);
    return createdTask;
  }

  async findAll(): Promise<Task[]> {
    return this.taskModel.find().exec();
  }

  async findOne(id: string): Promise<Task> {
    return this.taskModel.findOne({ _id: id }).exec();
  }

  async delete(id: string) {
    const deletedTask = await this.taskModel
      .findByIdAndRemove({ _id: id })
      .exec();
    return deletedTask;
  }
}
