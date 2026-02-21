import '../models/task_model.dart';

abstract class TaskRepository {
  Future<List<TaskModel>> byCycle(String cycleId);
  Future<void> save(TaskModel task);
  Future<void> delete(String taskId);
}
