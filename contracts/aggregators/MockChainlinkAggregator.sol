// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.10;

import {AggregatorV3Interface, AggregatorInterface} from "../dependencies/chainlink/AggregatorInterface.sol";

/// @notice MockChainlinkAggregator is a mock contract for the SupraAggregator
/// @dev This contract assumes the token_pair USDT_USD is valued 1 and does not retreive it from the Supra Oracle
contract MockChainlinkAggregator is AggregatorInterface, AggregatorV3Interface {
    /// @notice address of the asset the aggregator is suppporting
    address public asset;
    /// @notice decimals of the data from the aggregator
    uint8 public decimals;
    /// @notice mock price value to be returned to oracle
    int256 public price;
    /// @notice name of the token pair the aggregator is supporting
    string public tokenPair;

    constructor(
        address _asset,
        int256 _price,
        uint8 _decimals,
        string memory _tokenPair
    ) {
        asset = _asset;
        price = _price;
        decimals = _decimals;
        tokenPair = _tokenPair;
    }

    /// @notice Get latest answer for the asset returned in market BASE CURRENCY
    function latestAnswer() external view returns (int256) {
        return price;
    }

    /// @notice Get latest timestamp for the asset
    function latestTimestamp() external view returns (uint256) {
        return 0;
    }

    /// @notice Get latest round in which the asset has been updated
    function latestRound() external view returns (uint256) {
        return 0;
    }

    /// @notice getAnswer returns the price for a given roundId which is the static mock price
    function getAnswer(uint256 roundId) external view returns (int256) {
        return price;
    }

    /// @notice Not supported for mock aggregator
    function getTimestamp(uint256 roundId) external view returns (uint256) {
        return 0;
    }

    function description() external view returns (string memory) {
        return
            string(
                abi.encodePacked("Mock Chainlink Aggregator for ", tokenPair)
            );
    }

    function version() external view returns (uint256) {
        return 0;
    }

    function getRoundData(
        uint80 _roundId
    )
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        revert("Not supported for mock aggregator");
    }

    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        revert("Not supported for mock aggregator");
    }
}
