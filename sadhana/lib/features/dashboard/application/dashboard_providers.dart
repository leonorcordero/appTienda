import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../data/models/cycle_model.dart';
import '../../../data/models/task_model.dart';

final sampleCycleProvider = Provider<CycleModel>(
  (ref) => const CycleModel(
    id: 'demo',
    name: 'Ciclo Inicial',
    duration: 40,
    customDuration: true,
    startDay: 1,
    currentDay: 1,
    sankalpa: 'Cultivar presencia y disciplina diaria.',
    streakCurrent: 0,
    streakMax: 0,
    isActive: true,
  ),
);

final sampleTasksProvider = Provider<List<TaskModel>>(
  (ref) => const [
    TaskModel(id: '1', cycleId: 'demo', title: 'Meditación 20 min'),
    TaskModel(id: '2', cycleId: 'demo', title: 'Pranayama', description: 'Respiración consciente'),
  ],
);

final completedTasksProvider = StateProvider<Set<String>>((ref) => {});
