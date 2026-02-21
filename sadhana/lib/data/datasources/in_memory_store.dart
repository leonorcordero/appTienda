import '../models/cycle_model.dart';
import '../models/day_progress_model.dart';
import '../models/task_model.dart';

/// Implementación simple en memoria para facilitar pruebas y bootstrap inicial.
class InMemoryStore {
  final Map<String, CycleModel> cycles = {};
  final Map<String, TaskModel> tasks = {};
  final Map<String, DayProgressModel> dayProgress = {};
}
