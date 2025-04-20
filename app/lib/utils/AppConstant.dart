import 'package:app/pages/home_page.dart';
import 'package:app/pages/personal_details_page.dart';
import 'package:app/pages/voting_page.dart';
import 'package:flutter/material.dart';

class AppConstant {
  static String baseurlLocal = "http://192.168.1.136:3000/api";
  static List<Widget> navpages = [
    HomePage(),
    VotingPage(),
    PersonalDetailsPage()
  ];
}
