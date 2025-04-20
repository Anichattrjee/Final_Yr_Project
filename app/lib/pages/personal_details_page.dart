import 'package:app/database/local_storage.dart';
import 'package:app/pages/login_page.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../controllers/auth_controller.dart';
import '../utils/AppColors.dart';

class PersonalDetailsPage extends StatelessWidget {
  final AuthController _authController = Get.find();

  PersonalDetailsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white, // A softer background
      appBar: AppBar(
        toolbarHeight: 80, // Slightly reduced height
        backgroundColor: AppColors.primaryBlue,
        title: const Text(
          'My Profile', // More personal title
          style: TextStyle(
            fontWeight: FontWeight.w700, // Even bolder
            color: AppColors.white,
            fontSize: 22, // Slightly larger
          ),
        ),
        centerTitle: true,
        elevation: 3, // Subtle shadow
        shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(
            bottom: Radius.circular(16),
          ),
        ),
      ),
      body: Obx(
        () {
          if (_authController.user.isEmpty) {
            return const Center(
              child: CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(
                    AppColors.primaryBlue), // Themed progress indicator
              ),
            );
          }

          var userData = _authController.user;

          return SingleChildScrollView(
            padding: const EdgeInsets.symmetric(
                horizontal: 20.0, vertical: 30.0), // Increased vertical padding
            child: Column(
              crossAxisAlignment: CrossAxisAlignment
                  .center, // Center alignment for a cleaner look
              children: [
                // Profile Picture with a subtle shadow
                Container(
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.1),
                        spreadRadius: 2,
                        blurRadius: 10,
                        offset: const Offset(0, 5),
                      ),
                    ],
                  ),
                  child: CircleAvatar(
                    radius: 70, // Slightly smaller
                    backgroundColor: AppColors.primaryBlue
                        .withOpacity(0.8), // Softer background
                    child: Icon(
                      Icons.person,
                      size: 60, // Adjusted icon size
                      color: AppColors.white,
                    ),
                  ),
                ),
                const SizedBox(height: 16),

                // User Name
                Text(
                  userData["username"],
                  style: TextStyle(
                    fontSize: 26,
                    fontWeight: FontWeight.bold,
                    color: AppColors.primaryBlue,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 6),

                // User Role with a different style
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppColors.primaryBlue
                        .withOpacity(0.1), // Light background
                    borderRadius: BorderRadius.circular(15),
                  ),
                  child: Text(
                    userData["role"].toUpperCase(),
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: AppColors.primaryBlue,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ),
                const SizedBox(height: 24),

                // User Details Section with a card-like appearance
                Container(
                  padding: const EdgeInsets.all(20.0),
                  decoration: BoxDecoration(
                    color: AppColors.white,
                    borderRadius: BorderRadius.circular(15),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.05),
                        spreadRadius: 1,
                        blurRadius: 5,
                        offset: const Offset(0, 3),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      DetailRow(title: "Email", value: userData["email"]),
                      const Divider(
                          color: AppColors.grey,
                          height: 20), // Added divider for separation
                      DetailRow(
                        title: "Voting Status",
                        value: userData["hasVoted"] ? "Voted" : "Not Voted",
                        borderColor: userData["hasVoted"]
                            ? AppColors.green
                            : AppColors.red,
                        textColor: userData["hasVoted"]
                            ? AppColors.green
                            : AppColors.red,
                      ),
                      if (userData["role"] == "candidate")
                        const Divider(color: AppColors.grey, height: 20),
                      if (userData["role"] == "candidate")
                        DetailRow(
                          title: "Approval Status",
                          value: userData["candidateInfo"]["approved"]
                              ? "Approved"
                              : "Not Approved",
                          borderColor: userData["candidateInfo"]["approved"]
                              ? AppColors.green
                              : AppColors
                                  .red, // Different color for pending/not approved
                          textColor: userData["candidateInfo"]["approved"]
                              ? AppColors.green
                              : AppColors.red,
                        ),
                    ],
                  ),
                ),
                const SizedBox(height: 30),

                // Log Out Button with a more prominent style
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () async {
                      _authController.logout();
                      await LocalStorage.clearUserDetails();
                      Get.offAll(() => LoginPage());
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primaryBlue,
                      padding: const EdgeInsets.symmetric(vertical: 18),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      elevation: 5,
                      textStyle: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w600), // Larger text
                    ),
                    child: const Text(
                      'Log Out',
                      style: TextStyle(color: AppColors.white),
                    ),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}

class DetailRow extends StatelessWidget {
  final String title;
  final String value;
  final Color? borderColor;
  final Color? textColor;

  const DetailRow({
    super.key,
    required this.title,
    required this.value,
    this.borderColor,
    this.textColor,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(
          vertical: 10.0), // Slightly reduced vertical padding
      child: Row(
        mainAxisAlignment: MainAxisAlignment
            .spaceBetween, // Align title to start and value to end
        children: [
          Text(
            '$title:',
            style: TextStyle(
              fontWeight: FontWeight.w600,
              color: AppColors.primaryBlue,
              fontSize: 16,
            ),
          ),
          Expanded(
            child: Container(
              alignment: Alignment.centerRight, // Align value to the right
              padding: const EdgeInsets.symmetric(
                  horizontal: 12, vertical: 8), // Adjusted padding
              decoration: BoxDecoration(
                borderRadius:
                    BorderRadius.circular(10), // Slightly more rounded
              ),
              child: Text(
                value,
                style: TextStyle(
                  fontSize: 16,
                  color: textColor ?? AppColors.primaryBlue,
                  fontWeight: FontWeight.w500,
                ),
                overflow: TextOverflow.ellipsis,
                textAlign: TextAlign
                    .right, // Align text to the right within the container
              ),
            ),
          ),
        ],
      ),
    );
  }
}
