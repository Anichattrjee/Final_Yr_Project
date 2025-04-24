import 'package:app/database/local_storage.dart';
import 'package:app/pages/login_page.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../utils/AppColors.dart';
import 'voting_controller.dart';

class UserPage extends StatefulWidget {
  const UserPage({super.key});
  @override
  State<UserPage> createState() => _UserPageState();
}

class _UserPageState extends State<UserPage> {
  String email = '';
  String pwd = '';
  String uid = '';
  String name = '';

  final VotingController _votingController = Get.find();

  @override
  void initState() {
    super.initState();
    _loadUser();
  }

  Future<void> _loadUser() async {
    final _email = await LocalStorage.getUserEmail();
    final _pwd = await LocalStorage.getUserPassword();
    final _uid = await LocalStorage.getUid();
    final _name = await LocalStorage.getUserName();
    setState(() {
      email = _email ?? 'No Email';
      pwd = _pwd ?? 'No Password';
      uid = _uid ?? 'No UID';
      name = _name ?? 'No Name';
    });
  }

  Future<void> _logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text("Logged out successfully")),
    );
    Get.offAll(() => LoginPage());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(bottom: Radius.circular(20)),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, color: AppColors.white),
            onPressed: _loadUser,
          )
        ],
        toolbarHeight: 100,
        backgroundColor: AppColors.primaryBlue,
        title: const Text(
          'E-VOTING User Profile',
          style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.white),
        ),
        centerTitle: true,
        elevation: 5,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Card(
          color: AppColors.white,
          elevation: 2,
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                _infoTile("Name", name),
                const Divider(color: AppColors.primaryBlue),
                _infoTile("Email", email),
                const Divider(color: AppColors.primaryBlue),
                _infoTile("Password", '*' * pwd.length),
                const Divider(color: AppColors.primaryBlue),
                _infoTile("UID", uid),
                const Divider(color: AppColors.primaryBlue),
                const SizedBox(height: 12),
                _votingStatusCard(),
                const SizedBox(height: 30),
                ElevatedButton.icon(
                  icon: const Icon(Icons.logout, color: AppColors.white),
                  label: const Text("Logout",
                      style: TextStyle(color: AppColors.white)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.redAccent,
                    padding: const EdgeInsets.symmetric(
                        horizontal: 32, vertical: 12),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12)),
                  ),
                  onPressed: _logout,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _infoTile(String title, String value) {
    return Row(
      children: [
        Text("$title: ",
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        Expanded(
          child: Text(value,
              style: const TextStyle(fontSize: 16),
              overflow: TextOverflow.ellipsis),
        ),
      ],
    );
  }

  Widget _votingStatusCard() {
    return Obx(() {
      final voted = _votingController.hasVoted.value;
      final candidate = _votingController.selectedCandidate.value;

      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: voted ? Colors.green[50] : Colors.orange[50],
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
              color: voted ? Colors.green : Colors.orange, width: 1.5),
        ),
        child: Row(
          children: [
            Icon(
              voted ? Icons.how_to_vote : Icons.how_to_reg,
              color: voted ? Colors.green : Colors.orange,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    voted ? "You have voted" : "You have not voted",
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: voted ? Colors.green[800] : Colors.orange[800],
                    ),
                  ),
                  if (voted && candidate.isNotEmpty)
                    Padding(
                      padding: const EdgeInsets.only(top: 4.0),
                      child: Text(
                        "Candidate: $candidate",
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.grey[700],
                          fontStyle: FontStyle.italic,
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ],
        ),
      );
    });
  }
}
