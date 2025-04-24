import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:pie_chart/pie_chart.dart';

import '../utils/AppColors.dart';

class VotingResultPage extends StatelessWidget {
  final String title;
  final String date;

  const VotingResultPage({super.key, required this.title, required this.date});

  @override
  Widget build(BuildContext context) {
    // Dummy result data
    final List<Map<String, dynamic>> results = [
      {'name': 'Alice Johnson', 'votes': 124},
      {'name': 'Bob Smith', 'votes': 98},
      {'name': 'Clara Lee', 'votes': 45},
    ];

    // Convert to dataMap for PieChart
    final Map<String, double> dataMap = {
      for (var r in results) r['name']: r['votes'].toDouble()
    };

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
          'Voting Results',
          style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.white),
        ),
        centerTitle: true,
        elevation: 5,
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title,
                  style: const TextStyle(
                      fontSize: 22, fontWeight: FontWeight.bold)),
              Text("Held on $date",
                  style: const TextStyle(color: Colors.grey, fontSize: 14)),
              const SizedBox(height: 20),
              const Text('Results',
                  style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w600,
                      color: AppColors.primaryBlue)),
              const SizedBox(height: 12),
              ...results.map((result) {
                return Card(
                  margin: const EdgeInsets.symmetric(vertical: 8),
                  child: ListTile(
                    leading: const Icon(Icons.person),
                    title: Text(result['name']),
                    trailing: Text('${result['votes']} votes'),
                  ),
                );
              }).toList(),
              const SizedBox(height: 30),
              const Text('Vote Share',
                  style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w600,
                      color: AppColors.primaryBlue)),
              const SizedBox(height: 12),
              PieChart(
                dataMap: dataMap,
                animationDuration: const Duration(milliseconds: 800),
                chartRadius: MediaQuery.of(context).size.width / 2,
                colorList: [Colors.purple, Colors.orange, Colors.teal],
                chartType: ChartType.disc,
                chartValuesOptions: const ChartValuesOptions(
                  showChartValuesInPercentage: true,
                  showChartValueBackground: false,
                  decimalPlaces: 0,
                ),
                legendOptions: const LegendOptions(
                  showLegendsInRow: false,
                  legendPosition: LegendPosition.right,
                  showLegends: true,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
