import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:sadhana/features/dashboard/presentation/dashboard_page.dart';

void main() {
  testWidgets('muestra encabezado del dashboard', (tester) async {
    await tester.pumpWidget(const ProviderScope(child: MaterialApp(home: DashboardPage())));
    expect(find.text('Sadhana Dashboard'), findsOneWidget);
    expect(find.text('Tareas de hoy'), findsOneWidget);
  });
}
