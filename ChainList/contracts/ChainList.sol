pragma solidity ^0.4.18;

contract ChainList {
    // custom types
    struct Article {
        uint: id;
        address seller;
        address buyer;
        string name;
        string description;
        uint256 price;
    }

    // state variables
   mapping (uint => Article) public articles;
   uint ArticleCounter;

    // events
    event LogSellArticle(address indexed _seller, string _name, uint256 _price);
    event LogBuyArticle(
        address indexed _seller,
        address indexed _buyer,
        string _name,
        uint256 _price
    );

    // sell an article
    function sellArticle(
        string _name,
        string _description,
        uint256 _price
    ) public {
        // a new article
        articleCounter++;

        // store a new article inside the articles mapping
        articles[articleCounter] = Article(
            
        )


        LogSellArticle(seller, name, price);
    }

    // get an article
    function getArticle()
        public
        view
        returns (
            address _seller,
            address _buyer,
            string _name,
            string _description,
            uint256 _price
        )
    {
        return (seller, buyer, name, description, price);
    }

    // buy an article
    function buyArticle() public payable {
        // we check whether there is an article for sale
        require(seller != 0x0);

        // we check that the article has not been sold yet
        require(buyer == 0X0);

        // we don't allow the seller to buy his own article
        require(msg.sender != seller);

        // we check that the value sent corresponds to the price of the article
        require(msg.value == price);

        // keep buyer's information
        buyer = msg.sender;

        // the buyer can pay the seller
        seller.transfer(msg.value);

        // trigger the event
        LogBuyArticle(seller, buyer, name, price);
    }
}
