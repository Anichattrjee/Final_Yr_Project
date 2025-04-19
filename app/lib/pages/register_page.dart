import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:velocity_x/velocity_x.dart';

import '../controllers/auth_controller.dart';
import '../utils/AppColors.dart';
import 'login_page.dart';

class RegisterPage extends StatelessWidget {
  final AuthController authController = Get.put(AuthController());

  final TextEditingController uidController = TextEditingController();
  final TextEditingController nameController = TextEditingController();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

  final RxString selectedRole = 'voter'.obs;

  RegisterPage({super.key});

  void _submitForm() {
    final formData = {
      "uid": uidController.text.trim(),
      "name": nameController.text.trim(),
      "email": emailController.text.trim(),
      "password": passwordController.text.trim(),
      "role": selectedRole.value,
    };
    authController.register(formData);
  }

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
            30.heightBox,
            Text(
              'Create Account',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: AppColors.primaryBlue,
              ),
            ),
            20.heightBox,
            Text(
              'Register to continue securely',
              style: TextStyle(fontSize: 16, color: AppColors.grey),
            ),
            40.heightBox,

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
            16.heightBox,

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
            16.heightBox,

            // Phone
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
            16.heightBox,

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
            16.heightBox,

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
            5.heightBox,
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
            45.heightBox,

            // Register Button
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _submitForm,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primaryBlue,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: const Text(
                  'Register',
                  style: TextStyle(fontSize: 18, color: AppColors.white),
                ),
              ),
            ),
            16.heightBox,

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
