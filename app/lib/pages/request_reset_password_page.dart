import 'package:app/utils/AppColors.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../controllers/auth_controller.dart';
import 'login_page.dart';
import 'reset_password_page.dart'; // Make sure to import the ResetPasswordPage

class RequestResetPage extends StatelessWidget {
  final TextEditingController emailController = TextEditingController();
  final AuthController authController = Get.find();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      appBar: AppBar(
        automaticallyImplyLeading: false,
        leading: IconButton(
          icon: Icon(
            Icons.arrow_back_ios_new_rounded,
            color: AppColors.white,
            size: 35,
          ),
          onPressed: () => Get.off(() => LoginPage()),
        ),
        toolbarHeight: 100,
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
                  keyboardType: TextInputType.emailAddress,
                  controller: emailController,
                  decoration: InputDecoration(
                    labelText: 'Enter your email',
                    labelStyle: TextStyle(color: AppColors.primaryBlue),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderSide: BorderSide(color: AppColors.primaryBlue),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    prefixIcon: Icon(Icons.mail, color: AppColors.primaryBlue),
                  ),
                ),
                SizedBox(height: 20),
                Align(
                  alignment: Alignment.centerLeft,
                  child: Text(
                    'Note: You will receive a password reset token on your email',
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
                            final email = emailController.text.trim();
                            if (email.isNotEmpty) {
                              authController
                                  .requestPasswordReset(email)
                                  .then((_) {
                                // Once the reset token is requested successfully
                                Get.to(() =>
                                    ResetPasswordPage()); // Navigate to ResetPasswordPage
                              }).catchError((error) {
                                // Handle error (e.g., show error message)
                                Get.snackbar(
                                    "Error", "Failed to request reset token",
                                    backgroundColor: AppColors.white);
                              });
                            } else {
                              Get.snackbar("Error", "Please enter an email",
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
                            'Request Token',
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
