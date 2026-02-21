import 'package:flutter/material.dart';

import '../../../data/models/cycle_model.dart';

class CycleDetailPage extends StatelessWidget {
  const CycleDetailPage({super.key, required this.cycle});

  final CycleModel cycle;

  @override
  Widget build(BuildContext context) {
    final progress = cycle.currentDay / cycle.duration;
    return Scaffold(
      appBar: AppBar(title: Text(cycle.name)),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Sankalpa: ${cycle.sankalpa}'),
            const SizedBox(height: 12),
            LinearProgressIndicator(value: progress.clamp(0, 1)),
            const SizedBox(height: 8),
            Text('Racha actual: ${cycle.streakCurrent} | Máxima: ${cycle.streakMax}'),
          ],
        ),
      ),
    );
  }
}
