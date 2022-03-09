pragma solidity ^0.4.18;

contract Chainlist {
    // state variables
    address seller;
    address buyer;
    string name;
    string description;
    uint256 price;

    // events
    event LogSellArticle(address indexed _seller, string _name, uint256 _price);

    event LogBuyArticle(
        address indexed _seller,
        address indexed _buyer,
        string _name,
        uint256 _price
    )

    // constructor
    // function Chainlist() public {
    //     sellArticle(
    //         "Default article",
    //         "This is an article set by default",
    //         1000000000000000000
    //     );
    // }

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

        LogSellArticle(seller, name, price);
    }

    // function to get an article
    function getArticle()
        public
        view
        returns (
            address _seller,
            string _name,
            string _description,
            uint256 _price
        )
    {
        return (seller, name, description, price);
    }

    // function to buy an article
    function buyArticle()
        payable
        public
        {
            // check if the article is for sale
            require(seller != 0x0);

            // check that the article has not been sold yet
            require(buyer == 0X0);

            // do not allow seller to buy its own article
            require(msg.sender != seller);

            // check that the value sent corresponds to the price of article
            require(msg.value == price);

            // keep buyers information
            buyer = msg.sender

            // the buyer can pay the seller
            seller.transfer(msg.value);

            // trigger the event
            LogBuyArticle(seller, buyer, name, price)
        }

}
