// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

library BetUtils {
    struct BetData {
        string name;
    }

    struct BetOption {
        string name;
        uint256 totalAmount;
    }

    struct UserBet {
        uint256 optionId;
        uint256 amount;
    }

    enum BetState {
        UNINITIALIZED,
        PROPOSAL,
        READY,
        OPEN,
        RESOLVED,
        CANCELLED
    }

    struct Bet {
        uint256 id;
        BetData params;
        BetState state;
        BetOption[] options;
        mapping(address => UserBet[]) userBets; // userBets[address][optionId] represents chosen option of the user for the bet
        uint256 winningOptionId;
    }

    // Bet functions
    function populateOptionsFromStrings(
        Bet storage self,
        string[] memory _optionNames
    ) internal {
        self.options.push(BetOption("", 0)); // 0 index is reserved
        for (uint256 i = 0; i < _optionNames.length; i++) {
            BetOption memory option = BetOption(_optionNames[i], 0);
            self.options.push(option);
        }
    }

    function userOptionShare(
        Bet storage self,
        address _user,
        uint256 _optionId
    ) internal view returns (uint256) {
        require(_optionId != 0, "Option id cannot be 0");
        require(_optionId < self.options.length, "Invalid option id");

        uint256 userAmount = self.userBets[_user][_optionId].amount;
        uint256 totalAmountOption = self.options[_optionId].totalAmount;

        return (userAmount * (10 ** 18)) / totalAmountOption;
    }

    function multiplierOfOption(
        Bet storage self,
        uint256 _optionId
    ) internal view returns (uint256) {
        require(_optionId != 0, "Option id cannot be 0");
        require(_optionId < self.options.length, "Invalid option id");

        uint256 totalAmountAllOptions = 0;
        for (uint256 i = 1; i < self.options.length; i++) {
            totalAmountAllOptions += self.options[i].totalAmount;
        }

        return
            (totalAmountAllOptions * (10 ** 18)) /
            self.options[_optionId].totalAmount;
    }

    function userMultiplierOfOption(
        Bet storage self,
        address _user,
        uint256 _optionId
    ) internal view returns (uint256) {
        return
            ((multiplierOfOption(self, _optionId) / (10 ** 9)) *
                userOptionShare(self, _user, _optionId)) / (10 ** 9);
    }
}
