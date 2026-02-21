import 'package:flutter/material.dart';

import 'core/theme/app_theme.dart';
import 'features/dashboard/presentation/dashboard_page.dart';

class SadhanaApp extends StatelessWidget {
  const SadhanaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Sadhana',
      debugShowCheckedModeBanner: false,
      theme: appTheme,
      home: const DashboardPage(),
    );
  }
}
