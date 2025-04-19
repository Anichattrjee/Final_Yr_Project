import 'package:app/controllers/auth_controller.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../database/local_storage.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  AuthController authController = Get.put(AuthController());
  var user;
  String? name;
  String? email;

  @override
  void initState() {
    super.initState();
    user = authController.user;
    fetchUserData();
  }

  void fetchUserData() async {
    String? storedName = await LocalStorage.getUserName();
    String? storedEmail = await LocalStorage.getUserEmail();
    setState(() {
      name = storedName;
      email = storedEmail;
    });

    debugPrint("Fetched from SharedPreferences - Name: $name, Email: $email");
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Home Page")),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text("Welcome to the Homepage!"),
            const SizedBox(height: 20),
            if (name != null) Text("Username: $name"),
            if (email != null) Text("Email: $email"),
          ],
        ),
      ),
    );
  }
}
