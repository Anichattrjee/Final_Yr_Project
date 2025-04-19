import 'package:app/database/local_storage.dart';
import 'package:app/pages/login_page.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:velocity_x/velocity_x.dart';

import '../utils/AppColors.dart';

class PersonalDetailsPage extends StatelessWidget {
  final String role; // Can be 'Voter', 'Candidate', or 'Election Staff'

  const PersonalDetailsPage({super.key, required this.role});

  @override
  Widget build(BuildContext context) {
    String pageTitle;
    List<Map<String, String>> details;

    switch (role) {
      case 'Candidate':
        pageTitle = 'Candidate Details';
        details = [
          {'Name': 'Jay Das'},
          {'Party': 'National Progressive Party'},
          {'Constituency': 'Downtown District'},
          {'Contact': '+91 123 456 7890'},
          {'Manifesto': 'Focus on healthcare and education reforms.'},
        ];
        break;
      case 'Election Staff':
        pageTitle = 'Election Staff Details';
        details = [
          {'Name': 'Joydeep Sen'},
          {'Role': 'Presiding Officer'},
          {'Constiuencies': 'Krishna Nagar & Kolkata East'},
          {'Contact': '+91 987 654 3210'},
          {'Responsibilities': 'Ensure the integrity of the voting process.'},
        ];
        break;
      default:
        pageTitle = 'Voter Details';
        details = [
          {'Name': 'Aditya Roy'},
          {'Age': '30'},
          {'Election': 'LS24 Ph-2'},
          {'Constituency': 'Diamond Harbour'},
          {'Voter ID': 'ABCD123456'},
          {'Eligibility': 'ELIGIBLE'},
          {'Voting status': 'NOT VOTED'}
        ];
    }

    return Scaffold(
      backgroundColor: AppColors.white,
      appBar: AppBar(
        toolbarHeight: 100,
        backgroundColor: AppColors.primaryBlue,
        title: Text(
          pageTitle,
          style: const TextStyle(
            fontWeight: FontWeight.bold,
            color: AppColors.white,
          ),
        ),
        centerTitle: true,
        elevation: 5,
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Role Title
              20.heightBox,
              Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  // Profile Photo or CircleAvatar
                  CircleAvatar(
                    radius: 80, // Adjust size as needed
                    backgroundColor: AppColors.lightBlue,
                    child: Icon(
                      Icons.person,
                      size: 80, // Icon size
                      color: AppColors.primaryBlue,
                    ),
                  ),
                  16.heightBox,
                  // Text(
                  //   'Details for $role',
                  //   style: TextStyle(
                  //     fontSize: 24,
                  //     fontWeight: FontWeight.bold,
                  //     color: AppColors.primaryBlue,
                  //   ),
                  // ),
                  10.heightBox,
                ],
              ),
              30.heightBox,

              // Details Section
              ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: details.length,
                separatorBuilder: (context, index) => const Divider(),
                itemBuilder: (context, index) {
                  final entry = details[index];
                  return Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '${entry.keys.first}: ',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          color: AppColors.primaryBlue,
                          fontSize: 16,
                        ),
                      ),
                      Expanded(
                        child: Text(
                          entry.values.first,
                          style: const TextStyle(
                            fontSize: 16,
                          ),
                        ),
                      ),
                    ],
                  );
                },
              ),
              50.heightBox,

              // Back Button
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () async {
                    await LocalStorage.clearUserDetails();
                    Get.offAll(() => LoginPage());
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primaryBlue,
                    padding: const EdgeInsets.symmetric(
                        horizontal: 32, vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: const Text(
                    'Log Out',
                    style: TextStyle(fontSize: 16, color: AppColors.white),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
