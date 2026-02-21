import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../calendar/presentation/calendar_page.dart';
import '../../cycles/presentation/cycle_detail_page.dart';
import '../../tasks/presentation/task_list_widget.dart';
import '../application/dashboard_providers.dart';

class DashboardPage extends ConsumerWidget {
  const DashboardPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final cycle = ref.watch(sampleCycleProvider);
    final tasks = ref.watch(sampleTasksProvider);
    final completed = ref.watch(completedTasksProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Sadhana Dashboard')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Card(
              child: ListTile(
                title: Text(cycle.name),
                subtitle: Text('Sankalpa: ${cycle.sankalpa}'),
                trailing: Text('Racha: ${cycle.streakCurrent}'),
                onTap: () => Navigator.of(context).push(
                  MaterialPageRoute(builder: (_) => CycleDetailPage(cycle: cycle)),
                ),
              ),
            ),
            const SizedBox(height: 8),
            const Text('Tareas de hoy', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600)),
            TaskListWidget(
              tasks: tasks,
              completedIds: completed,
              onToggle: (taskId) {
                final next = {...completed};
                next.contains(taskId) ? next.remove(taskId) : next.add(taskId);
                ref.read(completedTasksProvider.notifier).state = next;
              },
            ),
            const SizedBox(height: 12),
            const Text('Calendario mensual', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600)),
            CalendarPage(
              completedDays: {DateTime.now()},
              failedDays: {DateTime.now().subtract(const Duration(days: 1))},
            ),
          ],
        ),
      ),
    );
  }
}
