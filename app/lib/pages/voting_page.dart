import 'package:app/dump/voting_section.dart';
import 'package:app/utils/AppColors.dart';
import 'package:flutter/material.dart';

class VotingPage extends StatefulWidget {
  const VotingPage({super.key});

  @override
  State<VotingPage> createState() => _VotingPageState();
}

class _VotingPageState extends State<VotingPage> {
  @override
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        toolbarHeight: 80, // Slightly reduced height
        backgroundColor: AppColors.primaryBlue,
        title: const Text(
          'Voting Page', // More personal title
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
      body: Padding(
        padding: EdgeInsets.all(16),
        child: VotingSection(),
      ),
    );
  }
}
