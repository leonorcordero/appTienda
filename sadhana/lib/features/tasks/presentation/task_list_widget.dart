import 'package:flutter/material.dart';

import '../../../data/models/task_model.dart';

class TaskListWidget extends StatelessWidget {
  const TaskListWidget({
    super.key,
    required this.tasks,
    required this.completedIds,
    required this.onToggle,
  });

  final List<TaskModel> tasks;
  final Set<String> completedIds;
  final ValueChanged<String> onToggle;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: tasks
          .map(
            (task) => CheckboxListTile(
              title: Text(task.title),
              subtitle: task.description != null ? Text(task.description!) : null,
              value: completedIds.contains(task.id),
              onChanged: (_) => onToggle(task.id),
            ),
          )
          .toList(),
    );
  }
}
