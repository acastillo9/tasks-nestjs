import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  const createTaskDto: CreateTaskDto = {
    title: 'Test task #1',
  };

  const mockTask = {
    title: 'Test task #1',
    _id: 'a id',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([
              {
                title: 'Test task #1',
              },
              {
                title: 'Test task #2',
              },
              {
                title: 'Test task #3',
              },
            ]),
            create: jest.fn().mockResolvedValue(createTaskDto),
            findOne: jest.fn().mockResolvedValue({
              title: 'Test task #1',
            }),
            delete: jest.fn().mockResolvedValue({
              title: 'Test task #1',
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {
    it('should create a new task', async () => {
      const createSpy = jest
        .spyOn(service, 'create')
        .mockResolvedValueOnce(mockTask as any);

      await controller.create(createTaskDto);
      expect(createSpy).toHaveBeenCalledWith(createTaskDto);
    });
  });

  describe('findAll()', () => {
    it('should return an array of tasks', async () => {
      expect(controller.findAll()).resolves.toEqual([
        {
          title: 'Test task #1',
        },
        {
          title: 'Test task #2',
        },
        {
          title: 'Test task #3',
        },
      ]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne()', () => {
    it('should return a task by id', async () => {
      expect(controller.findOne('id')).resolves.toEqual({
        title: 'Test task #1',
      });
      expect(service.findOne).toHaveBeenCalled();
    });
  });

  describe('delete()', () => {
    it('should delete a task', async () => {
      const createSpy = jest
        .spyOn(service, 'delete')
        .mockResolvedValueOnce(mockTask as any);

      const deletedTask = await controller.delete('id');
      expect(createSpy).toHaveBeenCalledWith('id');
      expect(deletedTask).toEqual(mockTask);
    });
  });
});
