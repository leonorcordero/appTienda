import 'package:uuid/uuid.dart';

import '../../../data/models/task_model.dart';
import '../../../data/repositories/cycle_repository.dart';
import '../../../data/repositories/task_repository.dart';

class TaskService {
  TaskService(this._taskRepository, this._cycleRepository);

  final TaskRepository _taskRepository;
  final CycleRepository _cycleRepository;
  static const _uuid = Uuid();

  Future<TaskModel> create({
    required String cycleId,
    required String title,
    String? description,
  }) async {
    final task = TaskModel(
      id: _uuid.v4(),
      cycleId: cycleId,
      title: title,
      description: description,
    );
    await _taskRepository.save(task);
    return task;
  }

  Future<void> delete(String taskId, String cycleId) async {
    final cycle = await _cycleRepository.getById(cycleId);
    if (cycle?.isActive == true) {
      throw StateError('No se pueden eliminar tareas en un ciclo activo');
    }
    await _taskRepository.delete(taskId);
  }
}
