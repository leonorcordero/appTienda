import 'dart:math';

import '../../../data/models/motivational_quote_model.dart';
import 'motivational_quotes.dart';

abstract class NotificationGateway {
  Future<void> scheduleReminder({required int id, required DateTime at, required String body});
  Future<void> showInstant({required int id, required String title, required String body});
}

class NotificationService {
  NotificationService(this._gateway);

  final NotificationGateway _gateway;

  Future<void> scheduleThreeReminders(DateTime day) async {
    final times = [
      DateTime(day.year, day.month, day.day, 10),
      DateTime(day.year, day.month, day.day, 16),
      DateTime(day.year, day.month, day.day, 21),
    ];
    for (var i = 0; i < times.length; i++) {
      await _gateway.scheduleReminder(
        id: 100 + i,
        at: times[i],
        body: _randomQuote(QuoteType.reminder),
      );
    }
  }

  Future<void> notifyDayCompleted() {
    return _gateway.showInstant(
      id: 900,
      title: 'Sadhana completada',
      body: _randomQuote(QuoteType.reward),
    );
  }

  String _randomQuote(QuoteType type) {
    final options = motivationalQuotes.where((q) => q.type == type).toList();
    return options[Random().nextInt(options.length)].message;
  }
}
