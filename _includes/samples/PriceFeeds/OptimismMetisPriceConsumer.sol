// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV2V3Interface.sol";

/**
 * Find information on LINK Token Contracts here: https://docs.chain.link/docs/link-token-contracts/
 */

contract PriceConsumerWithL2Sequencer {
    // Identifier of the Sequencer offline flag on the Flags contract
    AggregatorV2V3Interface internal priceFeed;
    AggregatorV2V3Interface internal sequencerUptimeFeed;

    uint256 private constant GRACE_PERIOD_TIME = 3600;

    error GracePeriodNotOver();

    /**
     * Network: Optimism
     * Data Feed: BTC/USD
     * Data Feed Proxy Address: 0xD702DD976Fb76Fffc2D3963D037dfDae5b04E593
     * Sequencer Uptime Proxy Address: 0x371EAD81c9102C9BF4874A9075FFFf170F2Ee389
     * For a list of available sequencer proxy addresses, see:
     * https://docs.chain.link/docs/l2-sequencer-flag/
     */
    constructor() {
        priceFeed = AggregatorV2V3Interface(0xD702DD976Fb76Fffc2D3963D037dfDae5b04E593);
        sequencerUptimeFeed = AggregatorV2V3Interface(0x371EAD81c9102C9BF4874A9075FFFf170F2Ee389);
    }

    /**
     * Returns the latest price
     */
    function getLatestPrice() public view returns (int) {
        if (!checkSequencerState()) {
                // If the sequencer is down, do not perform any critical operations
            revert("L2 sequencer down: Chainlink feeds are not being updated");
        }
        (
            /*uint80 roundID*/,
            int price,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = priceFeed.latestRoundData();
        return price;
    }

    /**
     * Check if the L2 sequencer is running
     */
    function checkSequencerState() public view returns (bool sequencerIsUp) {
        (
            /*uint80 roundId*/,
            int256 answer,
            uint256 startedAt,
            /*uint256 updatedAt*/,
            /*uint80 answeredInRound*/
        ) = sequencerUptimeFeed.latestRoundData();

        // Answer == 0: Sequencer is up
        // Answer == 1: Sequencer is down
        bool isSequencerUp = answer == 0; // 0 = up
        if (isSequencerUp) {
            uint256 timeSinceUp = block.timestamp - startedAt;
            if (timeSinceUp <= GRACE_PERIOD_TIME) {
                revert GracePeriodNotOver();
            }
        }
        return isSequencerUp;
    }
}