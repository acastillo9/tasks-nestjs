import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getModelToken } from '@nestjs/mongoose';
import { Task } from './schemas/task.schema';
import { Model } from 'mongoose';

const mockTask = {
  title: 'Test task #1',
};

describe('TasksService', () => {
  let service: TasksService;
  let model: Model<Task>;

  const tasksArray = [
    {
      title: 'Test task #1',
    },
    {
      title: 'Test task #2',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getModelToken('Task'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockTask),
            constructor: jest.fn().mockResolvedValue(mockTask),
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            findByIdAndRemove: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    model = module.get<Model<Task>>(getModelToken('Task'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all tasks', async () => {
    jest.spyOn(model, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(tasksArray),
    } as any);
    const tasks = await service.findAll();
    expect(tasks).toEqual(tasksArray);
  });

  it('should insert a new task', async () => {
    jest.spyOn(model, 'create').mockImplementationOnce(() =>
      Promise.resolve({
        title: 'Test task #1',
      } as any),
    );
    const newTask = await service.create({
      title: 'Test task #1',
    });
    expect(newTask).toEqual(mockTask);
  });

  it('should return one task', async () => {
    jest.spyOn(model, 'findOne').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce({
        title: 'Test task #1',
      }),
    } as any);
    const task = await service.findOne('id');
    expect(task).toEqual(mockTask);
  });

  it('should delete a task', async () => {
    jest.spyOn(model, 'findByIdAndRemove').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce({
        title: 'Test task #1',
      }),
    } as any);
    const deletedTask = await service.delete('id');
    expect(deletedTask).toEqual(mockTask);
  });
});
