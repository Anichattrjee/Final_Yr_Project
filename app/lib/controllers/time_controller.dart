import 'dart:async';
import 'package:get/get.dart';
import 'package:intl/intl.dart';

class TimeController extends GetxController {
  final RxString currentTime = ''.obs;
  final String sessionStartTime;
  late Timer _timer;

  TimeController() : sessionStartTime = _getCurrentFormattedTime();

  @override
  void onInit() {
    super.onInit();
    _startClock();
  }

  void _startClock() {
    _timer = Timer.periodic(const Duration(seconds: 1), (_) {
      currentTime.value = _getCurrentFormattedTime();
    });
  }

  static String _getCurrentFormattedTime() {
    return DateFormat('hh:mm:ss a').format(DateTime.now());
  }

  @override
  void onClose() {
    _timer.cancel();
    super.onClose();
  }
}
