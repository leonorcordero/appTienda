import '../../../data/models/cycle_model.dart';
import '../../../data/models/day_progress_model.dart';
import '../../../data/models/task_model.dart';
import '../../streaks/application/streak_service.dart';

class DayClosureResult {
  const DayClosureResult({required this.updatedCycle, required this.progress});

  final CycleModel updatedCycle;
  final DayProgressModel progress;
}

class DayClosureService {
  DayClosureService(this._streakService);

  final StreakService _streakService;

  /// Se ejecuta idealmente a las 23:59 via scheduler.
  DayClosureResult closeDay({
    required CycleModel cycle,
    required List<TaskModel> tasks,
    required Set<String> completedTaskIds,
    required DateTime date,
  }) {
    final activeTaskIds = tasks.where((t) => t.isActive).map((t) => t.id).toSet();
    final allCompleted = activeTaskIds.isNotEmpty && completedTaskIds.containsAll(activeTaskIds);
    final updated = _streakService.updateStreak(cycle: cycle, allTasksCompleted: allCompleted)
        .copyWith(currentDay: cycle.currentDay + 1);

    return DayClosureResult(
      updatedCycle: updated,
      progress: DayProgressModel(
        cycleId: cycle.id,
        isoDate: _iso(date),
        completedTaskIds: completedTaskIds,
        completed: allCompleted,
      ),
    );
  }

  String _iso(DateTime d) => DateTime(d.year, d.month, d.day).toIso8601String();
}
