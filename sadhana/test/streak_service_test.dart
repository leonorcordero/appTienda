import 'package:flutter_test/flutter_test.dart';
import 'package:sadhana/data/models/cycle_model.dart';
import 'package:sadhana/features/streaks/application/streak_service.dart';

void main() {
  test('incrementa racha cuando todas las tareas se completan', () {
    const cycle = CycleModel(
      id: '1',
      name: 'c',
      duration: 21,
      customDuration: true,
      startDay: 1,
      currentDay: 3,
      sankalpa: 'x',
      streakCurrent: 2,
      streakMax: 2,
      isActive: true,
    );

    final updated = StreakService().updateStreak(cycle: cycle, allTasksCompleted: true);
    expect(updated.streakCurrent, 3);
    expect(updated.streakMax, 3);
  });

  test('reinicia racha cuando faltan tareas', () {
    const cycle = CycleModel(
      id: '1',
      name: 'c',
      duration: 21,
      customDuration: true,
      startDay: 1,
      currentDay: 3,
      sankalpa: 'x',
      streakCurrent: 2,
      streakMax: 4,
      isActive: true,
    );

    final updated = StreakService().updateStreak(cycle: cycle, allTasksCompleted: false);
    expect(updated.streakCurrent, 0);
    expect(updated.streakMax, 4);
  });
}
