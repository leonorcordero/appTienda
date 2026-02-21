import '../models/day_progress_model.dart';

abstract class DayProgressRepository {
  Future<DayProgressModel?> byDate(String cycleId, DateTime date);
  Future<void> save(DayProgressModel progress);
}
