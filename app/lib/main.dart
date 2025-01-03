import 'package:app/auth/auth_wrapper.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';

import 'controllers/navigation_controller.dart';
import 'widgets/custom_cicular_progress.dart';

void main() async {
  await GetStorage.init();
  WidgetsFlutterBinding.ensureInitialized();
  Get.put(NavigationController());
  runApp(const MainApp());
}

class MainApp extends StatelessWidget {
  const MainApp({super.key});

  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      home: FutureBuilder<Widget>(
        future: AuthWrapper().navigateUser(), // The async navigation function
        builder: (context, snapshot) {
          // While waiting for the future, show a loading indicator
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CustomCircularProgress());
          }
          // If the snapshot has data, show the corresponding widget (either home or login)
          if (snapshot.hasData) {
            return snapshot.data!;
          }
          // If there’s an error, show an error message or fallback widget
          if (snapshot.hasError) {
            return const Center(child: Text("Error loading user data"));
          }
          // Fallback to empty container if no data (shouldn't reach here in most cases)
          return const Center(child: Text("Unexpected issue"));
        },
      ),
    );
  }
}
