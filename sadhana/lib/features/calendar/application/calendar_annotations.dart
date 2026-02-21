enum MoonPhase { newMoon, waxing, fullMoon, waning }

class SpiritualDay {
  const SpiritualDay({required this.date, required this.label});

  final DateTime date;
  final String label;
}

MoonPhase approximateMoonPhase(DateTime date) {
  final day = date.day;
  if (day <= 7) return MoonPhase.newMoon;
  if (day <= 14) return MoonPhase.waxing;
  if (day <= 21) return MoonPhase.fullMoon;
  return MoonPhase.waning;
}
