import 'package:uuid/uuid.dart';

import '../../../data/models/cycle_model.dart';
import '../../../data/repositories/cycle_repository.dart';

class CycleService {
  CycleService(this._repository);

  final CycleRepository _repository;
  static const _uuid = Uuid();

  Future<CycleModel> create({
    required String name,
    required int duration,
    required bool customDuration,
    required int startDay,
    required String sankalpa,
  }) async {
    final cycle = CycleModel(
      id: _uuid.v4(),
      name: name,
      duration: duration,
      customDuration: customDuration,
      startDay: startDay,
      currentDay: 1,
      sankalpa: sankalpa,
      streakCurrent: 0,
      streakMax: 0,
      isActive: false,
    );
    await _repository.save(cycle);
    return cycle;
  }

  Future<void> update(CycleModel updated) async {
    final current = await _repository.getById(updated.id);
    if (current == null) return;

    // Regla de negocio: sankalpa queda bloqueado una vez iniciado.
    final safe = current.isActive ? updated.copyWith(sankalpa: current.sankalpa) : updated;
    await _repository.save(safe);
  }

  Future<void> delete(String cycleId) => _repository.delete(cycleId);
}
