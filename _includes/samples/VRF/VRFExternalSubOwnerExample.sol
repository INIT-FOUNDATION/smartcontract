// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/dev/VRFConsumerBaseV2.sol";

contract VRFExternalSubOwnerExample is VRFConsumerBaseV2 {
  VRFCoordinatorV2Interface COORDINATOR;
  LinkTokenInterface LINKTOKEN;

  uint256[] public s_randomWords;
  uint256 public s_requestId;
  address s_owner;

  constructor(address vrfCoordinator, address link) VRFConsumerBaseV2(vrfCoordinator) {
    COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
    LINKTOKEN = LinkTokenInterface(link);
    s_owner = msg.sender;
  }

  function fulfillRandomWords(
    uint256, /* requestId */
    uint256[] memory randomWords
  ) internal override {
    s_randomWords = randomWords;
  }

  function requestRandomWords(
    uint64 subId,
    uint32 callbackGasLimit,
    uint16 requestConfirmations,
    uint32 numWords,
    bytes32 keyHash
  ) external onlyOwner {
    // Will revert if subscription is not funded.
    s_requestId = COORDINATOR.requestRandomWords(keyHash, subId, requestConfirmations, callbackGasLimit, numWords);
  }

  function transferOwnership(address newOwner) external onlyOwner {
    s_owner = newOwner;
  }

  modifier onlyOwner() {
    require(msg.sender == s_owner);
    _;
  }
}
