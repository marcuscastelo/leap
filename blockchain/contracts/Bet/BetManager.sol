// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "./BetUtils.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BetManager is Ownable {
    using BetUtils for BetUtils.Bet;

    uint256 public betCount = 0;
    mapping(uint256 => BetUtils.Bet) public bets;

    event BetCreated(uint256 betId);
    event BetStateChanged(
        uint256 indexed betId,
        BetUtils.BetState indexed state
    );

    event UserBetPlaced(
        address indexed user,
        uint256 indexed betId,
        uint256 optionId,
        uint256 amount
    );

    event UserBetTaken(
        address indexed user,
        uint256 indexed betId,
        uint256 optionId,
        uint256 amount
    );

    constructor() Ownable(msg.sender) {}

    // User functions
    function placeBet(
        uint256 _betId,
        uint256 _optionId,
        uint256 _amount
    ) public {
        BetUtils.Bet storage bet = bets[_betId];
        require(bet.state == BetUtils.BetState.OPEN, "Bet is not open or doesn't exist");

        BetUtils.UserBet storage userBet = bet.userBets[msg.sender][_betId];
        require(userBet.amount == 0, "User has already placed a bet");

        emit UserBetPlaced(msg.sender, _betId, _optionId, _amount);

        userBet.optionId = _optionId;
        userBet.amount = _amount;

        // TODO: make payable
        bet.options[_optionId].totalAmount += _amount;
    }

    function takeBet(uint256 _betId) public {
        BetUtils.Bet storage bet = bets[_betId];
        require(bet.state == BetUtils.BetState.OPEN, "Bet is not open or doesn't exist");

        BetUtils.UserBet storage userBet = bet.userBets[msg.sender][_betId];
        require(userBet.amount > 0, "User has not placed a bet");

        emit UserBetTaken(msg.sender, _betId, userBet.optionId, userBet.amount);

        // TODO: pay user back
        bet.options[userBet.optionId].totalAmount -= userBet.amount;
        userBet.amount = 0;
    }

    function rewardsOf(
        address _user,
        uint256 _betId
    ) public view returns (uint256) {
        BetUtils.Bet storage bet = bets[_betId];
        require(bet.state == BetUtils.BetState.RESOLVED, "Bet is not resolved");

        BetUtils.UserBet[] storage userBet = bet.userBets[_user];
        for (uint256 i = 0; i < userBet.length; i++) {
            if (userBet[i].optionId == bet.winningOptionId) {
                return bet.userMultiplierOfOption(_user, bet.winningOptionId);
            }
        }

        return 0;
    }

    function refundOf(
        address _user,
        uint256 _betId
    ) public view returns (uint256) {
        BetUtils.Bet storage bet = bets[_betId];
        require(
            bet.state == BetUtils.BetState.CANCELLED,
            "Bet is not cancelled"
        );

        BetUtils.UserBet[] storage userBet = bet.userBets[_user];
        for (uint256 i = 0; i < userBet.length; i++) {
            if (userBet[i].amount > 0) {
                return userBet[i].amount * (1 ** 18);
            }
        }

        return 0;
    }

    // Administrative functions

    function createYesNoBet(string memory _name) public onlyOwner {
        string[] memory optionStrings = new string[](2);
        optionStrings[0] = "Yes";
        optionStrings[1] = "No";

        BetUtils.Bet storage bet = _createBet(BetUtils.BetData(_name));
        bet.populateOptionsFromStrings(optionStrings);
        publishBetProposal(bet.id);
    }

    function _createBet(
        BetUtils.BetData memory _params
    ) internal onlyOwner returns (BetUtils.Bet storage) {
        betCount++;

        BetUtils.Bet storage bet = bets[betCount];

        bet.id = betCount;
        bet.params = _params;

        emit BetCreated(bet.id);
        return bet;
    }

    function publishBetProposal(uint256 _betId) public onlyOwner {
        require(
            bets[_betId].state == BetUtils.BetState.UNINITIALIZED,
            "Bet is not uninitialized"
        );
        _updateBetState(_betId, BetUtils.BetState.PROPOSAL);
    }

    function _updateBetState(
        uint256 _betId,
        BetUtils.BetState _state
    ) internal onlyOwner {
        if (_state == BetUtils.BetState.OPEN) {
            require(
                bets[_betId].state == BetUtils.BetState.READY,
                "Bet is not ready"
            );
        } else if (_state == BetUtils.BetState.RESOLVED) {
            require(
                bets[_betId].state == BetUtils.BetState.OPEN,
                "Bet is not open"
            );
        } else if (_state == BetUtils.BetState.PROPOSAL) {
            require(
                bets[_betId].state == BetUtils.BetState.UNINITIALIZED,
                "Bet is not uninitialized"
            );
        } else if (_state == BetUtils.BetState.UNINITIALIZED) {
            revert("Cannot set bet state to uninitialized");
        }

        BetUtils.Bet storage bet = bets[_betId];
        bet.state = _state;

        emit BetStateChanged(_betId, _state);
    }

    function approveBet(uint256 _betId) public onlyOwner {
        require(
            bets[_betId].state == BetUtils.BetState.PROPOSAL,
            "Bet is not a proposal"
        );
        _updateBetState(_betId, BetUtils.BetState.READY);
    }

    function openBet(uint256 _betId) public onlyOwner {
        require(
            bets[_betId].state == BetUtils.BetState.READY,
            "Bet is not ready"
        );
        _updateBetState(_betId, BetUtils.BetState.OPEN);
    }

    function resolveBet(
        uint256 _betId,
        uint256 _winningOptionId
    ) public onlyOwner {
        require(
            bets[_betId].state == BetUtils.BetState.OPEN,
            "Bet is not open"
        );
        require(
            _winningOptionId > 0,
            "Winning option ID must be greater than 0"
        );
        bets[_betId].winningOptionId = _winningOptionId;
        _updateBetState(_betId, BetUtils.BetState.RESOLVED);
        require(
            bets[_betId].winningOptionId > 0,
            "Bug: Winning option has not been set"
        );
    }

    function cancelBet(uint256 _betId) public onlyOwner {
        require(
            bets[_betId].state != BetUtils.BetState.UNINITIALIZED &&
                bets[_betId].state != BetUtils.BetState.RESOLVED,
            "Bet is not cancellable"
        );
        _updateBetState(_betId, BetUtils.BetState.CANCELLED);
    }
}
