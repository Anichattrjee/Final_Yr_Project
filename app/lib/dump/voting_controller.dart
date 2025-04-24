import 'package:get/get.dart';

class VotingController extends GetxController {
  final hasVoted = false.obs;
  final selectedCandidate = ''.obs;

  void voteFor(String candidateName) {
    if (!hasVoted.value) {
      selectedCandidate.value = candidateName;
      hasVoted.value = true;
    }
  }

  void resetVote() {
    hasVoted.value = false;
    selectedCandidate.value = '';
  }
}
