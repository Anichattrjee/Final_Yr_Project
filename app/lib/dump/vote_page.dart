import 'package:app/controllers/time_controller.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../utils/AppColors.dart';
import 'voting_controller.dart';

class VotePage extends StatelessWidget {
  final VotingController votingController = Get.find();
  final TimeController timeController = Get.find();
  final List<String> candidates = [
    'Alice Johnson',
    'Bob Smith',
    'Charlie Davis',
    'Diana Prince'
  ];

  VotePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
            onPressed: () {
              Get.back();
            },
            icon: Icon(
              Icons.arrow_back_ios_new_outlined,
              color: AppColors.white,
              size: 25,
            )),
        automaticallyImplyLeading: false,
        shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(bottom: Radius.circular(20)),
        ),
        toolbarHeight: 100,
        backgroundColor: AppColors.primaryBlue,
        title: const Text(
          'President election',
          style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.white),
        ),
        centerTitle: true,
        elevation: 5,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Obx(() {
          if (votingController.hasVoted.value) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.check_circle, color: Colors.green, size: 64),
                  const SizedBox(height: 16),
                  Text(
                    "You have already voted for",
                    style: const TextStyle(fontSize: 18),
                  ),
                  Text(
                    votingController.selectedCandidate.value,
                    style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Colors.deepPurple),
                  ),
                ],
              ),
            );
          } else {
            return Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  "Tap on a name to cast your vote:",
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 12),
                ...candidates.map((candidate) => _candidateTile(candidate)),
              ],
            );
          }
        }),
      ),
    );
  }

  Widget _candidateTile(String name) {
    return Card(
      borderOnForeground: true,
      color: AppColors.white,
      elevation: 3,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: ListTile(
        leading: const Icon(Icons.person),
        title: Text(name),
        trailing: const Icon(Icons.how_to_vote, color: AppColors.primaryBlue),
        onTap: () {
          Get.defaultDialog(
            buttonColor: AppColors.red,
            backgroundColor: AppColors.white,
            title: "Confirm Vote",
            middleText: "Are you sure you want to vote for $name?",
            textCancel: "Cancel",
            textConfirm: "Vote",
            confirmTextColor: Colors.white,
            onConfirm: () {
              votingController.voteFor(name);
              debugPrint("Voted to " +
                  name +
                  " at " +
                  timeController.currentTime.value);
              Get.back(); // Close dialog
              Future.delayed(Duration(seconds: 5), () {
                Get.snackbar("Thanks for participation",
                    "You will soon receive a confirmation receipt on email",
                    backgroundColor: AppColors.white);
              });
              Get.snackbar("Vote Casted", "You voted for $name",
                  backgroundColor: AppColors.white);
            },
          );
        },
      ),
    );
  }
}
