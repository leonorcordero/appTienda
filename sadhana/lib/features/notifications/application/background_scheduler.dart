/// Documenta la estrategia de plataforma para cierre diario + recordatorios.
///
/// Android: usar Workmanager para ejecutar tarea periódica diaria.
/// iOS: usar Background Fetch / BGTaskScheduler con callback equivalente.
class BackgroundSchedulerPlan {
  static const closeDayHour = 23;
  static const closeDayMinute = 59;

  static String instructions() {
    return 'Programar un worker diario a las 23:59 para cerrar el día y recalcular rachas.';
  }
}
