import 'package:app/pages/home_page.dart';
import 'package:app/pages/personal_details_page.dart';
import 'package:app/pages/voting_page.dart';
import 'package:flutter/material.dart';

class AppConstant {
  static List<Widget> navpages = [
    HomePage(),
    VotingPage(),
    PersonalDetailsPage(role: "")
  ];
}
