// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.10;

import {AggregatorV3Interface, AggregatorInterface} from "../dependencies/chainlink/AggregatorInterface.sol";
import {Ownable} from "../dependencies/openzeppelin/contracts/Ownable.sol";
import {SafeCast} from "../dependencies/openzeppelin/contracts/SafeCast.sol";
import {SafeMath} from "../dependencies/openzeppelin/contracts/SafeMath.sol";
import {ISupraSValueFeed} from "../dependencies/supra/ISupraSValueFeed.sol";

/// @notice SupraUsdAggregator is a contract implementing Chainlink aggregator interface for Intersect to obtain Supra oracle data
/// @dev This contract integrates the conversion to TOKEN_USDT pairs to TOKEN_USD pairs by using the price feed for USDT_USD
contract SupraUsdAggregator is Ownable, AggregatorInterface {
    /// @notice decimals of the data from the aggregator
    uint8 public decimals;
    /// @notice address of the asset the aggregator is suppporting
    address public asset;
    /// @notice address of the Supra Push Oracle contract
    ISupraSValueFeed public supraOracle;
    /// @notice price index id used by Supra for the identification of the token pair
    uint256 public assetPriceIndex;
    /// @notice price index id used by Supra for the identification of the USDT/USD pair
    /// @dev this price index is required for return price data in USD and not USDT
    uint256 public usdtUsdPriceIndex;
    /// @notice name of the token pair the aggregator is supporting
    string public tokenPair;

    constructor(
        address _asset,
        address _supraOracle,
        uint256 _assetPriceIndex,
        uint256 _usdtUsdPriceIndex,
        uint8 _decimals,
        string memory _tokenPair
    ) Ownable() {
        asset = _asset;
        supraOracle = ISupraSValueFeed(_supraOracle);
        assetPriceIndex = _assetPriceIndex;
        usdtUsdPriceIndex = _usdtUsdPriceIndex;
        decimals = _decimals;
        tokenPair = _tokenPair;
    }

    /// @notice Get latest answer for the asset returned in market BASE CURRENCY
    function latestAnswer() external view returns (int256) {
        ISupraSValueFeed.priceFeed memory priceFeed = supraOracle.getSvalue(assetPriceIndex);
        return SafeCast.toInt256(convertToUsd(priceFeed.price, decimals));
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

    /// @notice Convert the price of the asset to USD as
    function convertToUsd(uint256 price, uint256 priceDecimals) internal view returns (uint256) {
        // get usd price of the usdt
        ISupraSValueFeed.priceFeed memory usdtFeed = supraOracle.getSvalue(usdtUsdPriceIndex);

        // use the higher decimals of the two received
        uint256 maxDecimals = priceDecimals > usdtFeed.decimals ? priceDecimals : usdtFeed.decimals;
        uint256 usdtNormalizedPrice = normalizeDecimals(usdtFeed.price, usdtFeed.decimals, maxDecimals);
        uint256 priceNormalized = normalizeDecimals(price, priceDecimals, maxDecimals);

        // convert the asset_usdt pair to asset_usd pair
        uint256 usdPrice = SafeMath.div(SafeMath.mul(priceNormalized, usdtNormalizedPrice), (10 ** maxDecimals));

        // normalize the return to the contract defined decimals
        return normalizeDecimals(usdPrice, maxDecimals, decimals);
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
