// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.10;

import {AggregatorV3Interface, AggregatorInterface} from "../dependencies/chainlink/AggregatorInterface.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {SafeCast} from "@openzeppelin/contracts/utils/math/SafeCast.sol";
import {SafeMath} from "@openzeppelin/contracts/utils/math/SafeMath.sol";
import {ISupraSValueFeed} from "../dependencies/supra/ISupraSValueFeed.sol";

/// @notice SupraUsdtAggregator is a contract implementing Chainlink aggregator interface for Memelend to obtain Supra oracle data
contract SupraUsdtAggregator is Ownable, AggregatorInterface {
    /// @notice decimals of the data from the aggregator
    uint8 public decimals;
    /// @notice address of the asset the aggregator is suppporting
    address public asset;
    /// @notice address of the Supra Push Oracle contract
    ISupraSValueFeed public supraOracle;
    /// @notice price index id used by Supra for the identification of the token pair
    uint256 public assetPriceIndex;
    /// @notice price index id used by Supra for the identification of the USDT/USD pair
    /// @notice name of the token pair the aggregator is supporting
    string public tokenPair;

    constructor(
        address _asset,
        address _supraOracle,
        uint256 _assetPriceIndex,
        uint8 _decimals,
        string memory _tokenPair
    ) Ownable() {
        asset = _asset;
        supraOracle = ISupraSValueFeed(_supraOracle);
        assetPriceIndex = _assetPriceIndex;
        decimals = _decimals;
        tokenPair = _tokenPair;
    }

    /// @notice Get latest answer for the asset returned in market BASE CURRENCY
    function latestAnswer() external view returns (int256) {
        ISupraSValueFeed.priceFeed memory priceFeed = supraOracle.getSvalue(assetPriceIndex);

        uint256 normalizePrice = normalizeDecimals(priceFeed.price, priceFeed.decimals, decimals);

        return SafeCast.toInt256(normalizePrice);
    }

    /// @notice Get latest timestamp for the asset
    function latestTimestamp() external view returns (uint256) {
        return supraOracle.getTimestamp(assetPriceIndex);
    }

    /// @notice Get latest round in which the asset has been updated
    function latestRound() external view returns (uint256) {
        return supraOracle.getRound(assetPriceIndex);
    }

    /// @notice Not supported by Supra Oracle
    function getAnswer(uint256 roundId) external view returns (int256) {
        revert("Not supported by Supra");
    }

    /// @notice Not supported by Supra Oracle
    function getTimestamp(uint256 roundId) external view returns (uint256) {
        revert("Not supported by Supra");
    }

    /// @notice Shifts the pricing according to the difference in decimals
    function normalizeDecimals(uint256 price, uint256 currentDecimals, uint256 expectedDecimals)
        internal
        pure
        returns (uint256)
    {
        if (currentDecimals > expectedDecimals) {
            return SafeMath.div(price, (10 ** (currentDecimals - expectedDecimals)));
        } else if (currentDecimals < expectedDecimals) {
            return SafeMath.mul(price, (10 ** (expectedDecimals - currentDecimals)));
        }

        return price;
    }
}
