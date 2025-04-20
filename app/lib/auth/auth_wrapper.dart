import 'package:flutter/widgets.dart';
import 'package:get/get.dart';

import '../controllers/auth_controller.dart';
import '../database/local_storage.dart';
import '../pages/login_page.dart';
import '../pages/navigation_wrapper.dart';

class AuthWrapper {
  final AuthController _authController = Get.put(AuthController());

  var _loggedIn;
  String? _email = '';
  String? _password = '';

  Future<Widget> navigateUser() async {
    await fetchUser();

    if (_loggedIn != null && _loggedIn) {
      debugPrint(_loggedIn.toString());
      bool loginSuccess =
          await _authController.login(_email.toString(), _password.toString());

      if (loginSuccess) {
        return NavigationWrapper();
      } else {
        return LoginPage();
      }
    }

    return const LoginPage();
  }

  Future<void> fetchUser() async {
    _password = await LocalStorage.getUserPassword();
    _email = await LocalStorage.getUserEmail();
    _loggedIn = await LocalStorage.isLoggedIn();
  }
}
