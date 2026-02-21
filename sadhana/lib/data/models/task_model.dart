class TaskModel {
  const TaskModel({
    required this.id,
    required this.cycleId,
    required this.title,
    this.description,
    this.isActive = true,
  });

  final String id;
  final String cycleId;
  final String title;
  final String? description;
  final bool isActive;

  TaskModel copyWith({
    String? id,
    String? cycleId,
    String? title,
    String? description,
    bool? isActive,
  }) {
    return TaskModel(
      id: id ?? this.id,
      cycleId: cycleId ?? this.cycleId,
      title: title ?? this.title,
      description: description ?? this.description,
      isActive: isActive ?? this.isActive,
    );
  }
}
