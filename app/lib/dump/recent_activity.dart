//  import 'package:flutter/material.dart';
// import 'package:get/get.dart';

// Widget _recentActivityCard() {
//     return Obx(() {
//       final voted = votingController.hasVoted.value;
//       final candidate = votingController.selectedCandidate.value;

//       return Container(
//         padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
//         decoration: BoxDecoration(
//           color: voted ? Colors.green[50] : Colors.orange[50],
//           borderRadius: BorderRadius.circular(12),
//           border: Border.all(
//               color: voted ? Colors.green : Colors.orange, width: 1.5),
//         ),
//         child: Row(
//           children: [
//             Icon(
//               voted ? Icons.how_to_vote : Icons.how_to_reg,
//               color: voted ? Colors.green : Colors.orange,
//             ),
//             const SizedBox(width: 12),
//             Expanded(
//               child: Column(
//                 crossAxisAlignment: CrossAxisAlignment.start,
//                 children: [
//                   Text(
//                     voted ? "You have voted" : "You have not voted",
//                     style: TextStyle(
//                       fontSize: 16,
//                       fontWeight: FontWeight.w600,
//                       color: voted ? Colors.green[800] : Colors.orange[800],
//                     ),
//                   ),
//                   if (voted && candidate.isNotEmpty)
//                     Padding(
//                       padding: const EdgeInsets.only(top: 4.0),
//                       child: Text(
//                         "Candidate: $candidate",
//                         style: TextStyle(
//                           fontSize: 14,
//                           color: Colors.grey[700],
//                           fontStyle: FontStyle.italic,
//                         ),
//                       ),
//                     ),
//                 ],
//               ),
//             ),
//           ],
//         ),
//       );
//     });
//   }