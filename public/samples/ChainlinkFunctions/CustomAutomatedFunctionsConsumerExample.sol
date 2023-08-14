// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/FunctionsClient.sol";
import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";

/**
 * @title Functions contract used for Automation.
 * @notice This contract is a demonstration of using Functions and Automation.
 * @notice NOT FOR PRODUCTION USE
 */
contract CustomAutomatedFunctionsConsumerExample is
    FunctionsClient,
    AutomationCompatibleInterface,
    ConfirmedOwner
{
    uint256 public lastBlockNumber;
    bytes public request;
    uint64 public subscriptionId;
    uint32 public gasLimit;
    bytes32 public jobId;
    bytes32 public s_lastRequestId;
    bytes public s_lastResponse;
    bytes public s_lastError;

    error UnexpectedRequestID(bytes32 requestId);

    event Response(bytes32 indexed requestId, bytes response, bytes err);

    constructor(
        address router
    ) FunctionsClient(router) ConfirmedOwner(msg.sender) {}

    /**
     * @notice Checks if upkeep is needed based on the difference between the current and the last block number.
     * @dev This function checks if the current block number has incremented since the last recorded block number and returns a boolean indicating if upkeep is needed.
     * @return upkeepNeeded A boolean indicating if upkeep is needed (true if the current block number has incremented since the last recorded block number).
     * @return performData An empty bytes value since no additional data is needed for the upkeep in this implementation.
     */
    function checkUpkeep(
        bytes calldata /* checkData */
    )
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory performData)
    {
        upkeepNeeded = block.number - lastBlockNumber > 0; // Check if the current block number has incremented since the last recorded block number
        // We don't use the checkData in this example. The checkData is defined when the Upkeep was registered.
        return (upkeepNeeded, ""); // Return an empty bytes value for performData
    }

    /**
     * @notice Send a pre-encoded CBOR request if the current block number has incremented since the last recorded block number.
     * @dev We highly recommend revalidating the upkeep in the performUpkeep function. The performData is generated by the Automation Node's call to your checkUpkeep function and is not used in this implementation.
     */
    function performUpkeep(bytes calldata /* performData */) external override {
        //We highly recommend revalidating the upkeep in the performUpkeep function
        if (block.number - lastBlockNumber > 0) {
            s_lastRequestId = _sendRequest(
                request,
                subscriptionId,
                gasLimit,
                jobId
            );
            lastBlockNumber = block.number;
        }
        // We don't use the performData in this example. The performData is generated by the Automation Node's call to your checkUpkeep function
    }

    /// @notice Update the request settings
    /// @dev Only callable by the owner of the contract
    /// @param _request The new encoded CBOR request to be set. The request is encoded off-chain
    /// @param _subscriptionId The new subscription ID to be set
    /// @param _gasLimit The new gas limit to be set
    /// @param _jobId The new job ID to be set
    function updateRequest(
        bytes memory _request,
        uint64 _subscriptionId,
        uint32 _gasLimit,
        bytes32 _jobId
    ) external onlyOwner {
        request = _request;
        subscriptionId = _subscriptionId;
        gasLimit = _gasLimit;
        jobId = _jobId;
    }

    /**
     * @notice Store latest result/error
     * @param requestId The request ID, returned by sendRequest()
     * @param response Aggregated response from the user code
     * @param err Aggregated error from the user code or from the execution pipeline
     * Either response or error parameter will be set, but never both
     */
    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        if (s_lastRequestId != requestId) {
            revert UnexpectedRequestID(requestId);
        }
        s_lastResponse = response;
        s_lastError = err;
        emit Response(requestId, s_lastResponse, s_lastError);
    }
}
