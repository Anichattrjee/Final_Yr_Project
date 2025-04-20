import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../controllers/auth_controller.dart';
import '../utils/AppColors.dart';
import '../widgets/bottom_sheet.dart';
import 'login_page.dart';

class RegisterPage extends StatelessWidget {
  final AuthController authController = Get.put(AuthController());

  final TextEditingController uidController = TextEditingController();
  final TextEditingController nameController = TextEditingController();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

  final RxString selectedRole = 'voter'.obs;
  void clearController() {
    uidController.clear();
    nameController.clear();
    emailController.clear();
    passwordController.clear();
  }

  RegisterPage({super.key});

  @override
  Widget build(BuildContext context) {
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
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const SizedBox(height: 30),
            Text(
              'Create Account',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: AppColors.primaryBlue,
              ),
            ),
            const SizedBox(height: 20),
            Text(
              'Register to continue securely',
              style: TextStyle(fontSize: 16, color: AppColors.grey),
            ),
            const SizedBox(height: 40),

            // UID
            TextField(
              controller: uidController,
              decoration: InputDecoration(
                labelText: 'UID',
                labelStyle: TextStyle(color: AppColors.primaryBlue),
                prefixIcon: Icon(Icons.badge, color: AppColors.primaryBlue),
                border:
                    OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                focusedBorder: OutlineInputBorder(
                  borderSide: BorderSide(color: AppColors.primaryBlue),
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Name
            TextField(
              controller: nameController,
              decoration: InputDecoration(
                labelText: 'Name',
                labelStyle: TextStyle(color: AppColors.primaryBlue),
                prefixIcon: Icon(Icons.person, color: AppColors.primaryBlue),
                border:
                    OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                focusedBorder: OutlineInputBorder(
                  borderSide: BorderSide(color: AppColors.primaryBlue),
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Email
            TextField(
              controller: emailController,
              keyboardType: TextInputType.emailAddress,
              decoration: InputDecoration(
                labelText: 'Email',
                labelStyle: TextStyle(color: AppColors.primaryBlue),
                prefixIcon: Icon(Icons.email, color: AppColors.primaryBlue),
                border:
                    OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                focusedBorder: OutlineInputBorder(
                  borderSide: BorderSide(color: AppColors.primaryBlue),
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Password
            TextField(
              controller: passwordController,
              obscureText: true,
              decoration: InputDecoration(
                labelText: 'Password',
                labelStyle: TextStyle(color: AppColors.primaryBlue),
                prefixIcon: Icon(Icons.lock, color: AppColors.primaryBlue),
                border:
                    OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                focusedBorder: OutlineInputBorder(
                  borderSide: BorderSide(color: AppColors.primaryBlue),
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Role Dropdown
            Obx(() => DropdownButtonFormField<String>(
                  value: selectedRole.value,
                  items: [
                    'voter',
                  ]
                      .map((role) => DropdownMenuItem(
                            value: role,
                            child: Text(role.capitalize!),
                          ))
                      .toList(),
                  onChanged: (value) => selectedRole.value = value!,
                  decoration: InputDecoration(
                    labelText: 'Select Role',
                    labelStyle: TextStyle(color: AppColors.primaryBlue),
                    border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12)),
                    focusedBorder: OutlineInputBorder(
                      borderSide: BorderSide(color: AppColors.primaryBlue),
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                )),
            const SizedBox(height: 5),
            Align(
              alignment: Alignment.centerLeft,
              child: Text(
                'Note: For candidate registration contact admin.',
                style: TextStyle(
                  fontSize: 14,
                  color: AppColors.grey,
                ),
              ),
            ),
            const SizedBox(height: 45),

            // Register Button
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  authController
                      .register(emailController.text, uidController.text,
                          'voter', nameController.text, passwordController.text)
                      .then((value) {
                    if (value) {
                      showModalBottomSheet(
                        context: context, // use local context from build method
                        isDismissible: false,
                        backgroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius:
                              BorderRadius.vertical(top: Radius.circular(20)),
                        ),
                        builder: (ctx) => registrationBottomSheetContent(ctx),
                      );

                      Future.delayed(Duration(seconds: 3), () {
                        Navigator.of(context).pop(); // pop the bottom sheet
                        Get.off(() => const LoginPage());
                      });
                    }
                  });
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
                        'Register',
                        style: TextStyle(fontSize: 18, color: AppColors.white),
                      ),
              ),
            ),
            const SizedBox(height: 16),

            // Redirect to Login
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text('Already Registered?',
                    style: TextStyle(color: AppColors.grey)),
                TextButton(
                  onPressed: () {
                    Get.off(() => const LoginPage());
                  },
                  child: Text('Login',
                      style: TextStyle(color: AppColors.primaryBlue)),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
