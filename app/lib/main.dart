import 'package:app/auth/auth_wrapper.dart';
import 'package:app/dump/voting_controller.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'controllers/navigation_controller.dart';
import 'widgets/custom_cicular_progress.dart';
void main() async {
  await GetStorage.init();
  WidgetsFlutterBinding.ensureInitialized();
  Get.put(NavigationController());
  Get.put(VotingController());
  runApp(const MainApp());
}
class MainApp extends StatelessWidget {
  const MainApp({super.key});
  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      home: FutureBuilder<Widget>(
        future: AuthWrapper().navigateUser(), 
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Scaffold(
              body: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    CustomCircularProgress(),
                    SizedBox(height: 16),
                    Text(
                      'Please wait...',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w500,
                        color: Colors.grey,
                      ),
                    ),
                  ],
                ),
              ),
            );
          }
          if (snapshot.hasData) {
            return snapshot.data!;
          }
          if (snapshot.hasError) {
            return const Center(child: Text("Error loading user data"));
          }
          return const Center(child: Text("Unexpected issue"));
        },
      ),
    );
  }
}
