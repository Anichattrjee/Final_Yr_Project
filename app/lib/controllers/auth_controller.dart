import 'dart:convert';

import 'package:app/database/local_storage.dart';
import 'package:app/utils/AppConstant.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:http/http.dart' as http;

class AuthController extends GetxController {
  var isLoading = false.obs;
  var errorMessage = ''.obs;
  var token = ''.obs;
  var user = {}.obs;
  var loggedIn = false.obs;
  final String baseUrl = AppConstant.baseurlLocal + '/auth';

  Future<bool> login(String email, String password) async {
    debugPrint("inside login");
    debugPrint(baseUrl);
    isLoading.value = true;
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': email, 'password': password}),
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 200) {
        loggedIn.value = true;
        token.value = data['token'];
        user.value = data['user'];

        await LocalStorage.saveUserDetails(
            name: data['user']['username'],
            email: data['user']['email'],
            pwd: password);
        debugPrint('user loggedIn' + loggedIn.value.toString());
        Get.snackbar("Login Success", "Welcome, ${data['user']['username']}!");
        return true;
      } else {
        throw Exception(data['message']);
      }
    } catch (e) {
      errorMessage.value = e.toString();
      Get.snackbar("Login Failed", errorMessage.value);
    } finally {
      isLoading.value = false;
    }
    return false;
  }

  Future<void> register(Map<String, dynamic> formData) async {
    debugPrint("inside register");
    debugPrint(baseUrl);
    isLoading.value = true;
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/register'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(formData),
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 201) {
        Get.snackbar("Registration Success", data['message']);
      } else {
        throw Exception(data['message']);
      }
    } catch (e) {
      errorMessage.value = e.toString();
      Get.snackbar("Registration Failed", errorMessage.value);
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> requestPasswordReset(String email) async {
    isLoading.value = true;
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/reset-password-request'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': email}),
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 200) {
        Get.snackbar("Token Sent", "Reset token: ${data['resetToken']}");
        // In production, you'd email the token and not show it
      } else {
        throw Exception(data['message']);
      }
    } catch (e) {
      errorMessage.value = e.toString();
      Get.snackbar("Reset Failed", errorMessage.value);
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> resetPassword(String token, String newPassword) async {
    isLoading.value = true;
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/reset-password'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'token': token, 'newPassword': newPassword}),
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 200) {
        Get.snackbar("Success", data['message']);
      } else {
        throw Exception(data['message']);
      }
    } catch (e) {
      errorMessage.value = e.toString();
      Get.snackbar("Reset Failed", errorMessage.value);
    } finally {
      isLoading.value = false;
    }
  }

  void logout() {
    token.value = '';
    user.value = {};
    Get.snackbar("Logout", "You have successfully logged out.");
  }

  Future<bool> verifyFingerprint(String fingerprintData) async {
    isLoading.value = true;
    try {
      await Future.delayed(Duration(seconds: 2));
      if (fingerprintData == "valid_fingerprint") {
        Get.snackbar("Fingerprint Verified", "Access Granted!");
        return true;
      } else {
        throw Exception("Fingerprint verification failed.");
      }
    } catch (e) {
      errorMessage.value = e.toString();
      Get.snackbar("Error", errorMessage.value);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  Future<bool> verifyFace(String faceData) async {
    isLoading.value = true;
    try {
      await Future.delayed(Duration(seconds: 2));
      if (faceData == "valid_face_data") {
        Get.snackbar("Face Verified", "Access Granted!");
        return true;
      } else {
        throw Exception("Face verification failed.");
      }
    } catch (e) {
      errorMessage.value = e.toString();
      Get.snackbar("Error", errorMessage.value);
      return false;
    } finally {
      isLoading.value = false;
    }
  }
}
