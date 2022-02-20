// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../interfaces/ILimitedCellToken.sol";
import "hardhat/console.sol";

contract LimitedCellToken is ERC721, Ownable, ILimitedCellToken {
    using SafeMath for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenCounter;

    uint256 constant MAX_INVITE = 2;

    mapping(address => uint256) memberInviteCount;
    mapping(address => uint256) rankCount;

    constructor() ERC721("CellToken", "Cell") {
      rankCount[msg.sender] = 0;
    }

  modifier onlyOwnerOrMember() {
    require(
      msg.sender == owner() || balanceOf(msg.sender) >= 1,
      "not member"
    );
    _;
  }

  modifier caninvite(address _to) {
    require(
      (msg.sender == owner() || memberInviteCount[msg.sender] < MAX_INVITE) 
      && balanceOf(_to) <= 0,
      "cannot invite"
    );
    _;
  }

  function mintAndTransfer(address _to) public override onlyOwnerOrMember caninvite(_to)  {
    _tokenCounter.increment();

    uint256 _newItemId = _tokenCounter.current();
    _safeMint(msg.sender, _newItemId);
    safeTransferFrom(msg.sender, _to, _newItemId);

    memberInviteCount[msg.sender] = memberInviteCount[msg.sender].add(1);
    rankCount[_to] = rankCount[msg.sender].add(1);
  }

  function getTotalSupply() external override view returns (uint256) {
    return _tokenCounter.current();
  }
}