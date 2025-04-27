import 'package:app/controllers/auth_controller.dart';
import 'package:app/controllers/time_controller.dart';
import 'package:app/dump/voting_section.dart';
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
                'Hello, $name 👋',
                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  color: AppColors.primaryBlue,
                ),
              ),
            const SizedBox(height: 16),
            Text(
              'Session Started',
              style: TextStyle(
                fontSize: 14,
                color: AppColors.grey.withOpacity(0.9),
                fontWeight: FontWeight.w500,
              ),
            ),
            Text(
              timeController.sessionStartTime,
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: Colors.black87,
              ),
            ),
            const SizedBox(height: 16),
            Obx(() => Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Current Time',
                      style: TextStyle(
                        fontSize: 14,
                        color: AppColors.grey.withOpacity(0.9),
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    Text(
                      timeController.currentTime.value,
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                        color: Colors.black87,
                      ),
                    ),
                  ],
                )),
            const SizedBox(height: 24),
            Divider(
              color: AppColors.primaryBlue,
              thickness: 1.2,
            ),
            const SizedBox(height: 24),
            VotingSection(),
          ],
        ),
      ),
    );
  }
}
