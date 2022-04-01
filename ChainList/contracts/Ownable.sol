pragma solidity >0.4.99 <0.6.0;

contract Ownable {
    // state variables
    address payable owner;

    // modifiers
    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "This function can only be called by the contract owner"
        );
        _;
    }

    // constructor
    constructor() public {
        owner = msg.sender;
    }
}
