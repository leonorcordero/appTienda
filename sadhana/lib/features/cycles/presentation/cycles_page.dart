import 'package:flutter/material.dart';

import '../../../data/models/cycle_model.dart';

class CyclesPage extends StatelessWidget {
  const CyclesPage({super.key, required this.cycles, required this.onTap});

  final List<CycleModel> cycles;
  final ValueChanged<CycleModel> onTap;

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: cycles.length,
      itemBuilder: (context, i) {
        final cycle = cycles[i];
        return ListTile(
          title: Text(cycle.name),
          subtitle: Text('Día ${cycle.currentDay}/${cycle.duration}'),
          trailing: cycle.isActive ? const Icon(Icons.play_circle_fill) : null,
          onTap: () => onTap(cycle),
        );
      },
    );
  }
}
