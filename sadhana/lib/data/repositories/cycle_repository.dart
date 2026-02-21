import '../models/cycle_model.dart';

abstract class CycleRepository {
  Future<List<CycleModel>> getAll();
  Future<CycleModel?> getById(String id);
  Future<void> save(CycleModel cycle);
  Future<void> delete(String id);
}
