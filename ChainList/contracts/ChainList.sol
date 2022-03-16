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
    event LogSellArticle(uint indexed _id, address indexed _seller, string _name, uint256 _price);

    event LogBuyArticle(
        uint indexed _id,
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

        // store the new article inside the articles mapping
        articles[articleCounter] = Article(
            articleCounter,
            msg.sender,
            0x0,
            _name,
            _description,
            _price
        )


        LogSellArticle(articleCounter, seller, name, price);
    }

    // fetch the number of articles in the contract
    function getNumberOfArticles() public view returns (uint) {
        return articleCounter;
    }

    // fetch and return all article IDs for articles still for sale 
    function getArticlesForSale() public view returns (uint[]) {
        // prepare output array
        uint[] memory articleIds = new uint[](articleCounter);
    }

    // buy an article
    function buyArticle(uint _id) public payable {
        // we check whether there is an article for sale
        require(articleCounter > 0);

        // we check that the article exists
        require(_id > 0 && _id <= articleCounter);

        // retreive the article from the mapping
        Article storage article = articles[_id];

        // we check that the article has not been sold yet
        require(article.buyer == 0X0);

        // we don't allow the seller to buy his own article
        require(msg.sender != article.seller);

        // we check that the value sent corresponds to the price of the article
        require(msg.value == article.price);

        // keep buyer's information
        article.buyer = msg.sender;

        // the buyer can pay the seller
        article.seller.transfer(msg.value);

        // trigger the event
        LogBuyArticle(_id, article.seller, article.buyer, article.name, article.price);
    }
}
