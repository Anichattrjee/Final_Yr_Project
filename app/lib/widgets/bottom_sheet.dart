import 'package:app/pages/login_page.dart';
import 'package:app/utils/AppColors.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

Widget registrationBottomSheetContent(BuildContext context) {
  return Container(
    width: double.infinity,
    padding: const EdgeInsets.all(20),
    decoration: const BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
    ),
    child: Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        const Icon(Icons.check_circle, color: Colors.green, size: 60),
        const SizedBox(height: 16),
        const Text(
          'Registration Successful!',
          style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 10),
        const Text(
          'Taking you to login page...',
          style: TextStyle(fontSize: 16, color: Colors.grey),
        ),
        const SizedBox(height: 20),
        SizedBox(
          width: double.infinity,
          child: ElevatedButton(
            style: ElevatedButton.styleFrom(
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12)),
              backgroundColor: AppColors.primaryBlue,
              elevation: 2,
            ),
            onPressed: () {
              Navigator.pop(context); // Close the bottom sheet
              Get.off(() => const LoginPage()); // Navigate to login page
            },
            child: const Text(
              'Go to Login',
              style: TextStyle(color: AppColors.white),
            ),
          ),
        ),
      ],
    ),
  );
}
