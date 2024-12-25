import 'package:flutter/widgets.dart';
import 'package:get/get.dart';
import '../controllers/auth_controller.dart';
import '../database/local_storage.dart';
import '../pages/login_page.dart';
import '../pages/navigation_wrapper.dart';

class AuthWrapper {
  final AuthController _authController = Get.put(AuthController());
 
  var _user;  // to be modified with the user-model after the backend is ready
  String? _email;

  Future<Widget> navigateUser() async {
    _user = _authController.user.value;

    if (_user != null) {
      // _email = await LocalStorage.getUserEmail();
      // if (_email != null && _email!.isNotEmpty) {
        return NavigationWrapper(); 
      // } 
      // else {
      //   return const LoginPage();
      // }
    } else {
      return const LoginPage();
    }
  }

  // Optional: This method can be used to explicitly fetch user data when needed
  void fetchUser() async {
    _user = _authController.user.value;
    _email = await LocalStorage.getUserEmail();
  }
}