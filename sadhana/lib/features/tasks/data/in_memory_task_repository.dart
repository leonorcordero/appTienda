import '../../../data/datasources/in_memory_store.dart';
import '../../../data/models/task_model.dart';
import '../../../data/repositories/task_repository.dart';

class InMemoryTaskRepository implements TaskRepository {
  InMemoryTaskRepository(this._store);

  final InMemoryStore _store;

  @override
  Future<List<TaskModel>> byCycle(String cycleId) async {
    return _store.tasks.values.where((t) => t.cycleId == cycleId).toList();
  }

  @override
  Future<void> delete(String taskId) async => _store.tasks.remove(taskId);

  @override
  Future<void> save(TaskModel task) async => _store.tasks[task.id] = task;
}
