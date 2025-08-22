pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ZChainToken is ERC20, Ownable {
    uint256 public constant TOTAL_SUPPLY = 1000000000 * 10**18; // 1B tokens
    
    constructor() ERC20("ZChain Token", "ZCHAIN") {
        _mint(msg.sender, TOTAL_SUPPLY);
    }
    
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}