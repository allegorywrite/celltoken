// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "../interfaces/ICellToken.sol";
import "hardhat/console.sol";

contract CellToken is ERC721, Ownable, ICellToken {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenCounter;

  constructor() ERC721("CellToken", "Cell") {}

  modifier onlyOwnerOrMember() {
    require(
      msg.sender == owner() || balanceOf(msg.sender) >= 1,
      "not member"
    );
    _;
  }

  function mintAndTransfer(address _to) public override onlyOwnerOrMember {
    _tokenCounter.increment();

    uint256 _newItemId = _tokenCounter.current();
    _safeMint(msg.sender, _newItemId);
    safeTransferFrom(msg.sender, _to, _newItemId);
  }

  function getTotalSupply() external override view returns (uint256) {
    return _tokenCounter.current();
  }
}