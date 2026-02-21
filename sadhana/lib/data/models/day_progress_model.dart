class DayProgressModel {
  const DayProgressModel({
    required this.cycleId,
    required this.isoDate,
    required this.completedTaskIds,
    required this.completed,
  });

  final String cycleId;
  final String isoDate;
  final Set<String> completedTaskIds;
  final bool completed;
}
