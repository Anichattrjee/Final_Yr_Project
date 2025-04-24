import 'package:app/utils/AppColors.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

import 'vote_page.dart';
import 'voting_result_page.dart';

class VotingSection extends StatelessWidget {
  const VotingSection({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      // padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _sectionHeader("Upcoming Votings"),
          const SizedBox(height: 12),
          _votingCard(
            "Company President Election",
            "21 Apr 2025",
            "Live",
            onTap: () {
              Get.to(() => VotePage());
              print("Live voting tapped");
            },
          ),
          _votingCard("Operations HM Selection", "28 Apr 2025", "Upcoming",
              onTap: () => Get.snackbar(
                  'The voting is not live yet!!', 'Kindly check the date',
                  backgroundColor: AppColors.white)),
          const SizedBox(height: 20),
          _sectionHeader("Past Votings"),
          const SizedBox(height: 12),
          _votingCard(
            "Board of Sales & Mktd.",
            "10 Apr 2025",
            "Completed",
            onTap: () {
              Get.to(() => const VotingResultPage(
                    title: "Board of Sales & Mktd.",
                    date: "10 Apr 2025",
                  ));
            },
          ),
          _votingCard(
            "Employee Welfare Commt. Voting",
            "05 Apr 2025",
            "Completed",
            onTap: () {
              Get.to(() => const VotingResultPage(
                    title: "Employee Welfare Commt. Voting",
                    date: "05 Apr 2025",
                  ));
            },
          ),
        ],
      ),
    );
  }

  Widget _sectionHeader(String title) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          title,
          style: const TextStyle(
            fontSize: 22,
            fontWeight: FontWeight.bold,
            color: Colors.black,
          ),
        ),
        const Text(
          'See all',
          style: TextStyle(
            fontSize: 14,
            color: Colors.grey,
          ),
        ),
      ],
    );
  }

  Widget _votingCard(String title, String date, String status,
      {VoidCallback? onTap}) {
    final Color statusColor = _getStatusColor(status);

    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: const [
            BoxShadow(
                color: Colors.black12, blurRadius: 6, offset: Offset(0, 2))
          ],
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Colors.grey.shade200),
        ),
        child: Row(
          children: [
            const Icon(Icons.how_to_vote, color: Colors.deepPurple, size: 32),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title,
                      style: const TextStyle(
                          fontSize: 16, fontWeight: FontWeight.w600)),
                  const SizedBox(height: 4),
                  Text(date, style: TextStyle(color: Colors.grey.shade600)),
                ],
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: statusColor.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                status,
                style: TextStyle(
                  color: statusColor,
                  fontWeight: FontWeight.bold,
                  fontSize: 12,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case "Upcoming":
        return Colors.deepPurpleAccent;
      case "Completed":
        return Colors.green;
      case "Live":
        return Colors.redAccent;
      default:
        return Colors.grey;
    }
  }
}
