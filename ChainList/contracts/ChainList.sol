pragma solidity ^0.4.18;

contract Chainlist {
    // state variables
    address seller;
    string name;
    string description;
    uint256 price;

    // function to sell an article
    function sellArticle(
        string _name,
        string _description,
        uint256 _price
    ) public {
        seller = msg.sender;
        name = _name;
        description = _description;
        price = _price;
    }
}
