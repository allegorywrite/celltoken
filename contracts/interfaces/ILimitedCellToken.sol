// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ILimitedCellToken {
  
  function mintAndTransfer(address _to) external;
  function getTotalSupply() external view returns (uint256);
}