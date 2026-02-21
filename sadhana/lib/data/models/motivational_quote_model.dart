enum QuoteType { reward, reminder }

class MotivationalQuote {
  const MotivationalQuote({required this.type, required this.message});

  final QuoteType type;
  final String message;
}
