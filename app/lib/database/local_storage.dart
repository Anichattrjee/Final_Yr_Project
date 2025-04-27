import 'package:shared_preferences/shared_preferences.dart';

class LocalStorage {
  static const String _keyName = 'userName';
  static const String _keyEmail = 'userEmail';
  static const String _keyLoggedIn = 'loggedIn';
  static const String _keyPassWord = 'passWord';
  static const String _uid = 'uid';
  // Save user details
  static Future<void> saveUserDetails(
      {required String name,
      required String email,
      required String pwd,
      required String uid}) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_keyName, name);
    await prefs.setString(_keyEmail, email);
    await prefs.setBool(_keyLoggedIn, true);
    await prefs.setString(_keyPassWord, pwd);
    await prefs.setString(_uid, uid);
  }

  // Getters
  static Future<String?> getUserName() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_keyName);
  }

  static Future<String?> getUid() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_uid);
  }

  static Future<String?> getUserEmail() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_keyEmail);
  }

  static Future<bool> isLoggedIn() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_keyLoggedIn) ?? false;
  }

  static Future<String?> getUserPassword() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_keyPassWord);
  }

  // Clear user details
  static Future<void> clearUserDetails() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_keyName);
    await prefs.remove(_keyEmail);
    await prefs.remove(_keyLoggedIn);
    await prefs.remove(_keyPassWord);
  }
}
