class CycleModel {
  const CycleModel({
    required this.id,
    required this.name,
    required this.duration,
    required this.customDuration,
    required this.startDay,
    required this.currentDay,
    required this.sankalpa,
    required this.streakCurrent,
    required this.streakMax,
    required this.isActive,
  });

  final String id;
  final String name;
  final int duration;
  final bool customDuration;
  final int startDay;
  final int currentDay;
  final String sankalpa;
  final int streakCurrent;
  final int streakMax;
  final bool isActive;

  CycleModel copyWith({
    String? id,
    String? name,
    int? duration,
    bool? customDuration,
    int? startDay,
    int? currentDay,
    String? sankalpa,
    int? streakCurrent,
    int? streakMax,
    bool? isActive,
  }) {
    return CycleModel(
      id: id ?? this.id,
      name: name ?? this.name,
      duration: duration ?? this.duration,
      customDuration: customDuration ?? this.customDuration,
      startDay: startDay ?? this.startDay,
      currentDay: currentDay ?? this.currentDay,
      sankalpa: sankalpa ?? this.sankalpa,
      streakCurrent: streakCurrent ?? this.streakCurrent,
      streakMax: streakMax ?? this.streakMax,
      isActive: isActive ?? this.isActive,
    );
  }
}
