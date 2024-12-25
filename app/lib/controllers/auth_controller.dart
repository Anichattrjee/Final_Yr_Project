import 'package:get/get.dart';

class AuthController extends GetxController {
  var isLoading = false.obs;
  var errorMessage = ''.obs;
  var user =
      ''.obs; // to be modified with the user-model after the backend is ready
  Future<void> login(String username, String password) async {
    isLoading.value = true;
    try {
      await Future.delayed(Duration(seconds: 2));
      if (username == "test" && password == "password") {
        Get.snackbar("Login Success", "Welcome, $username!");
        user.value = "testuser";
      } else {
        throw Exception("Invalid username or password.");
      }
    } catch (e) {
      errorMessage.value = e.toString();
      Get.snackbar("Login Failed", errorMessage.value);
    } finally {
      isLoading.value = false;
    }
  }

  void logout() {
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
