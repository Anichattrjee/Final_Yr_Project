import 'package:app/dump/python_dump.dart';
import 'package:app/dump/user_page.dart';
import 'package:app/pages/home_page.dart';
import 'package:flutter/material.dart';

class AppConstant {
  static String baseurlLocal = "http://192.168.0.136:3000/api";
  static List<Widget> navpages = [
    HomePage(),
    // VotingPage(),
    PythonDumpTestPage(),
    // PersonalDetailsPage()

    UserPage()
  ];
}
