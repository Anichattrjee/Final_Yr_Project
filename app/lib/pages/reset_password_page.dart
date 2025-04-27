import 'package:app/utils/AppColors.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../controllers/auth_controller.dart';

class ResetPasswordPage extends StatelessWidget {
  final TextEditingController tokenController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final AuthController authController = Get.find();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      appBar: AppBar(
        toolbarHeight: 100,
        automaticallyImplyLeading: false,
        backgroundColor: AppColors.primaryBlue,
        title: const Text(
          'E-VOTING SYSTEMS',
          style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.white),
        ),
        centerTitle: true,
        elevation: 5,
      ),
      body: Obx(() => Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                SizedBox(height: 20),
                TextField(
                  controller: tokenController,
                  decoration: InputDecoration(
                    labelText: 'Reset token',
                    labelStyle: TextStyle(color: AppColors.primaryBlue),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderSide: BorderSide(color: AppColors.primaryBlue),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    prefixIcon: Icon(Icons.key, color: AppColors.primaryBlue),
                  ),
                ),
                SizedBox(height: 20),
                TextField(
                  controller: passwordController,
                  obscureText: true,
                  decoration: InputDecoration(
                    labelText: 'Enter new password',
                    labelStyle: TextStyle(color: AppColors.primaryBlue),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderSide: BorderSide(color: AppColors.primaryBlue),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    prefixIcon: Icon(Icons.lock, color: AppColors.primaryBlue),
                  ),
                ),
                SizedBox(height: 20),
                Align(
                  alignment: Alignment.centerLeft,
                  child: Text(
                    'Note: Enter the password alongwith the token you received in the email',
                    style: TextStyle(
                      fontSize: 14,
                      color: AppColors.grey,
                    ),
                  ),
                ),
                SizedBox(height: 20),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: authController.isLoading.value
                        ? null
                        : () {
                            final token = tokenController.text.trim();
                            final newPassword = passwordController.text.trim();
                            if (token.isNotEmpty && newPassword.isNotEmpty) {
                              authController.resetPassword(token, newPassword);
                            } else {
                              Get.snackbar("Error", "All fields are required",
                                  backgroundColor: AppColors.white);
                            }
                          },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primaryBlue,
                      padding: EdgeInsets.symmetric(vertical: 15),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    child: authController.isLoading.value
                        ? CircularProgressIndicator(
                            color: AppColors.white,
                          )
                        : Text(
                            'Reset Password',
                            style: TextStyle(color: Colors.white, fontSize: 16),
                          ),
                  ),
                ),
              ],
            ),
          )),
    );
  }
}
