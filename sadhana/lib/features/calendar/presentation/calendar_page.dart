import 'package:flutter/material.dart';
import 'package:table_calendar/table_calendar.dart';

class CalendarPage extends StatelessWidget {
  const CalendarPage({super.key, required this.completedDays, required this.failedDays});

  final Set<DateTime> completedDays;
  final Set<DateTime> failedDays;

  @override
  Widget build(BuildContext context) {
    return TableCalendar<void>(
      firstDay: DateTime.utc(2020),
      lastDay: DateTime.utc(2100),
      focusedDay: DateTime.now(),
      calendarBuilders: CalendarBuilders(
        defaultBuilder: (context, day, _) {
          final d = DateTime(day.year, day.month, day.day);
          final isCompleted = completedDays.contains(d);
          final isFailed = failedDays.contains(d);
          return Container(
            margin: const EdgeInsets.all(4),
            decoration: BoxDecoration(
              color: isCompleted
                  ? Colors.green
                  : isFailed
                      ? Colors.red
                      : null,
              shape: BoxShape.circle,
            ),
            child: Center(child: Text('${day.day}')),
          );
        },
      ),
    );
  }
}
