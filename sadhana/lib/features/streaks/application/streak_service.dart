import '../../../data/models/cycle_model.dart';

class StreakService {
  CycleModel updateStreak({required CycleModel cycle, required bool allTasksCompleted}) {
    final current = allTasksCompleted ? cycle.streakCurrent + 1 : 0;
    final max = current > cycle.streakMax ? current : cycle.streakMax;
    return cycle.copyWith(streakCurrent: current, streakMax: max);
  }
}
