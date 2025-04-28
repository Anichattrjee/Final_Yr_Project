import 'dart:convert';

import 'package:app/utils/AppColors.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class PythonDumpTestPage extends StatefulWidget {
  @override
  _PythonDumpTestPageState createState() => _PythonDumpTestPageState();
}

class _PythonDumpTestPageState extends State<PythonDumpTestPage> {
  final FlaskApiService apiService = FlaskApiService();
  final TextEditingController _numberController = TextEditingController();
  String result = '';
  bool isLoading = false;

  void _getSquare() async {
    setState(() {
      isLoading = true;
      result = ''; // Reset result before making the API call
    });

    int? number = int.tryParse(_numberController.text);
    if (number != null) {
      // Call the API and wait for the response
      String res = await apiService.getSquare(number);
      setState(() {
        isLoading = false;
        result = res; // Update the result based on API response
      });
    } else {
      setState(() {
        result = 'Please enter a valid number.';
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Flask API Example',
          style: TextStyle(color: AppColors.white),
        ),
        backgroundColor: AppColors.primaryBlue,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Text(
              'Enter a number to get its square:',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
            ),
            SizedBox(height: 16),
            TextField(
              controller: _numberController,
              keyboardType: TextInputType.number,
              decoration: InputDecoration(
                border: OutlineInputBorder(),
                labelText: 'Enter number',
                hintText: 'e.g., 5',
                suffixIcon: Icon(Icons.calculate),
              ),
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: isLoading ? null : _getSquare,
              child: isLoading
                  ? CircularProgressIndicator(color: Colors.white)
                  : Text('Get Square',
                      style: TextStyle(color: AppColors.white)),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primaryBlue,
                padding: EdgeInsets.symmetric(vertical: 12, horizontal: 24),
                textStyle: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
            ),
            SizedBox(height: 20),
            result.isNotEmpty
                ? Text(
                    result,
                    style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Colors.green),
                  )
                : Container(),
          ],
        ),
      ),
    );
  }
}

class FlaskApiService {
  final String baseUrl =
      'http://192.168.0.136:3000'; // Your local Flask server URL

  Future<String> getSquare(int number) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/square'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'number': number}),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        print('Square result: ${data['result']}');
        return 'Square of $number is ${data['result']}'; // Return the result to be shown
      } else {
        print('Error: ${response.body}');
        return 'Error: ${response.body}';
      }
    } catch (e) {
      print('Error: $e');
      return 'Error: $e';
    }
  }
}
