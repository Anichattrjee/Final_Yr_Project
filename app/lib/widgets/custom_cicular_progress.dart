import 'package:app/utils/AppColors.dart';
import 'package:flutter/material.dart';

class CustomCircularProgress extends StatelessWidget {
  final bool isDarkMode;

  const CustomCircularProgress({super.key, this.isDarkMode = false});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Container(
        width: 70.0,
        height: 70.0,
        decoration: BoxDecoration(
          color: isDarkMode ? AppColors.primaryBlue : AppColors.white,
          shape: BoxShape.circle,
          boxShadow: const [
            BoxShadow(
              color: Colors.black26,
              blurRadius: 10,
              offset: Offset(0, 4),
            ),
          ],
        ),
        padding: const EdgeInsets.all(12.0),
        child: CircularProgressIndicator(
          strokeWidth: 5.0,
          valueColor: AlwaysStoppedAnimation<Color>(AppColors.primaryBlue),
          backgroundColor: Colors
              .transparent, // Transparent background to blend with container
        ),
      ),
    );
  }
}
