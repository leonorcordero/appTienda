import 'package:flutter_test/flutter_test.dart';
import 'package:sadhana/data/models/cycle_model.dart';
import 'package:sadhana/data/models/task_model.dart';
import 'package:sadhana/features/streaks/application/streak_service.dart';
import 'package:sadhana/features/tasks/application/day_closure_service.dart';

void main() {
  test('marca el día como completo si todas las tareas activas están listas', () {
    const cycle = CycleModel(
      id: 'c1',
      name: 'Ciclo',
      duration: 40,
      customDuration: true,
      startDay: 1,
      currentDay: 10,
      sankalpa: 'Disciplina',
      streakCurrent: 5,
      streakMax: 5,
      isActive: true,
    );
    const tasks = [
      TaskModel(id: 't1', cycleId: 'c1', title: 'A'),
      TaskModel(id: 't2', cycleId: 'c1', title: 'B'),
    ];

    final service = DayClosureService(StreakService());
    final result = service.closeDay(
      cycle: cycle,
      tasks: tasks,
      completedTaskIds: {'t1', 't2'},
      date: DateTime(2026, 1, 1),
    );

    expect(result.progress.completed, isTrue);
    expect(result.updatedCycle.streakCurrent, 6);
    expect(result.updatedCycle.currentDay, 11);
  });
}
