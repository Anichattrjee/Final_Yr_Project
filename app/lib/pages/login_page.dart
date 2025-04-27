import 'package:app/pages/request_reset_password_page.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../controllers/auth_controller.dart';
import '../utils/AppColors.dart';
import 'navigation_wrapper.dart';
import 'register_page.dart';

class LoginPage extends StatelessWidget {
  const LoginPage({super.key});

  @override
  Widget build(BuildContext context) {
    debugPrint("login page");

    final AuthController authController = Get.put(AuthController());
    final TextEditingController emailController = TextEditingController();
    final TextEditingController passwordController = TextEditingController();

    return Scaffold(
      backgroundColor: AppColors.white,
      appBar: AppBar(
        toolbarHeight: 100,
        backgroundColor: AppColors.primaryBlue,
        title: const Text(
          'E-VOTING SYSTEMS',
          style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.white),
        ),
        centerTitle: true,
        elevation: 5,
      ),
      body: Obx(() => SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  SizedBox(
                    height: 100,
                  ),
                  Text(
                    'Welcome Back!',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: AppColors.primaryBlue,
                    ),
                  ),
                  SizedBox(height: 100),
                  Text(
                    'Please log in to continue',
                    style: TextStyle(
                      fontSize: 16,
                      color: AppColors.grey,
                    ),
                  ),
                  const SizedBox(height: 32),

                  // Email Field
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
                      prefixIcon:
                          Icon(Icons.mail, color: AppColors.primaryBlue),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Password Field
                  TextField(
                    controller: passwordController,
                    obscureText: true,
                    decoration: InputDecoration(
                      labelText: 'Enter your Password',
                      labelStyle: TextStyle(color: AppColors.primaryBlue),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderSide: BorderSide(color: AppColors.primaryBlue),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      prefixIcon:
                          Icon(Icons.lock, color: AppColors.primaryBlue),
                    ),
                  ),
                  const SizedBox(height: 16),

                  Align(
                    alignment: Alignment.centerLeft,
                    child: Text(
                      'Note: Use your registered email and password for secure login.',
                      style: TextStyle(
                        fontSize: 14,
                        color: AppColors.grey,
                      ),
                    ),
                  ),
                  SizedBox(
                    height: 45,
                  ),

                  // Login Button
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: authController.isLoading.value
                          ? null
                          : () {
                              final email = emailController.text.trim();
                              final password = passwordController.text.trim();
                              if (email.isEmpty || password.isEmpty) {
                                Get.snackbar("Error",
                                    "Please enter both email and password",
                                    backgroundColor: Colors.redAccent,
                                    colorText: Colors.white);
                              } else {
                                authController
                                    .login(email, password)
                                    .then((value) {
                                  if (value)
                                    Get.offAll(() => NavigationWrapper());
                                });
                              }
                            },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primaryBlue,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: authController.isLoading.value
                          ? const CircularProgressIndicator(color: Colors.white)
                          : const Text(
                              'Login',
                              style: TextStyle(
                                  fontSize: 18, color: AppColors.white),
                            ),
                    ),
                  ),

                  const SizedBox(height: 16),

                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text('Forgot your password?',
                          style: TextStyle(color: AppColors.grey)),
                      TextButton(
                        onPressed: () {
                          Get.off(() => RequestResetPage());
                        },
                        child: Text('Reset Here',
                            style: TextStyle(color: AppColors.primaryBlue)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text('New user?',
                          style: TextStyle(color: AppColors.grey)),
                      TextButton(
                        onPressed: () {
                          Get.off(() => RegisterPage());
                        },
                        child: Text('Register Now',
                            style: TextStyle(color: AppColors.primaryBlue)),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          )),
    );
  }
}
