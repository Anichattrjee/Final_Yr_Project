import 'package:app/controllers/auth_controller.dart';
import 'package:app/controllers/time_controller.dart';
import 'package:app/utils/AppColors.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../database/local_storage.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final AuthController authController = Get.put(AuthController());
  final TimeController timeController = Get.put(TimeController());
  String? name;
  String? email;

  @override
  void initState() {
    super.initState();
    fetchUserData();
  }

  void fetchUserData() async {
    String? storedName = await LocalStorage.getUserName();
    String? storedEmail = await LocalStorage.getUserEmail();
    setState(() {
      name = storedName;
      email = storedEmail;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      appBar: AppBar(
        toolbarHeight: 80,
        backgroundColor: AppColors.primaryBlue,
        elevation: 3,
        shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(bottom: Radius.circular(20)),
        ),
        title: const Text(
          'E-Voting HOME',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            color: AppColors.white,
            fontSize: 22,
          ),
        ),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 36),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (name != null)
              Text(
                'Hi, $name 👋',
                style: TextStyle(
                  fontSize: 26,
                  fontWeight: FontWeight.w600,
                  color: AppColors.primaryBlue,
                ),
              ),
            const SizedBox(height: 12),
            Obx(() => Text(
                  'Session Started: ${timeController.currentTime.value}',
                  style: TextStyle(
                    fontSize: 16,
                    color: AppColors.primaryBlue.withOpacity(0.7),
                  ),
                )),
            const SizedBox(height: 32),
            // Card(
            //   elevation: 4,
            //   shape: RoundedRectangleBorder(
            //       borderRadius: BorderRadius.circular(16)),
            //   color: AppColors.primaryBlue.withOpacity(0.05),
            //   child: Padding(
            //     padding: const EdgeInsets.all(24.0),
            //     child: Column(
            //       children: [
            //         Icon(Icons.person, color: AppColors.primaryBlue, size: 50),
            //         const SizedBox(height: 16),
            //         if (name != null)
            //           Text(
            //             name!,
            //             style: TextStyle(
            //               fontSize: 20,
            //               fontWeight: FontWeight.bold,
            //               color: AppColors.primaryBlue,
            //             ),
            //           ),
            //         if (email != null)
            //           Padding(
            //             padding: const EdgeInsets.only(top: 8.0),
            //             child: Text(
            //               email!,
            //               style: TextStyle(
            //                 fontSize: 14,
            //                 color: AppColors.primaryBlue.withOpacity(0.8),
            //               ),
            //             ),
            //           ),
            //       ],
            //     ),
            //   ),
            // ),
          ],
        ),
      ),
    );
  }
}
