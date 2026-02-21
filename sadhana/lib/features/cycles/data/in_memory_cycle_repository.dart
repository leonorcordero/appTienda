import '../../../data/datasources/in_memory_store.dart';
import '../../../data/models/cycle_model.dart';
import '../../../data/repositories/cycle_repository.dart';

class InMemoryCycleRepository implements CycleRepository {
  InMemoryCycleRepository(this._store);

  final InMemoryStore _store;

  @override
  Future<void> delete(String id) async => _store.cycles.remove(id);

  @override
  Future<List<CycleModel>> getAll() async => _store.cycles.values.toList();

  @override
  Future<CycleModel?> getById(String id) async => _store.cycles[id];

  @override
  Future<void> save(CycleModel cycle) async => _store.cycles[cycle.id] = cycle;
}
