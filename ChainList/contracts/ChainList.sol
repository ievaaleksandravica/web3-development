pragma solidity >0.4.99 <0.6.0;

import "./Ownable.sol";

contract ChainList is Ownable {
    // custom types
    struct Article {
        uint256 id;
        address payable seller;
        address buyer;
        string name;
        string description;
        uint256 price;
    }

    // state variables
    mapping(uint256 => Article) public articles;
    uint256 articleCounter;

    // events
    event LogSellArticle(
        uint256 indexed _id,
        address indexed _seller,
        string _name,
        uint256 _price
    );

    event LogBuyArticle(
        uint256 indexed _id,
        address indexed _seller,
        address indexed _buyer,
        string _name,
        uint256 _price
    );

    // deactivate the contract
    function kill() public onlyOwner {
        selfdestruct(owner);
    }

    // sell an article
    function sellArticle(
        string memory _name,
        string memory _description,
        uint256 _price
    ) public {
        // a new article
        articleCounter++;

        // store the new article inside the articles mapping
        articles[articleCounter] = Article(
            articleCounter,
            msg.sender,
            address(0),
            _name,
            _description,
            _price
        );

        emit LogSellArticle(articleCounter, msg.sender, _name, _price);
    }

    // fetch the number of articles in the contract
    function getNumberOfArticles() public view returns (uint256) {
        return articleCounter;
    }

    // fetch and return all article IDs for articles still for sale
    function getArticlesForSale() public view returns (uint256[] memory) {
        // prepare output array
        uint256[] memory articleIds = new uint256[](articleCounter);

        uint256 numberOfArticlesForSale = 0;

        // iterate over articles
        for (uint256 i = 1; i <= articleCounter; i++) {
            // keep the ID is if the article is still for sale
            if (articles[i].buyer == address(0)) {
                articleIds[numberOfArticlesForSale] = articles[i].id;
                numberOfArticlesForSale++;
            }
        }

        // copy the articleIds array into smaller forSale array
        uint256[] memory forSale = new uint256[](numberOfArticlesForSale);
        for (uint256 j = 0; j < numberOfArticlesForSale; j++) {
            forSale[j] = articleIds[j];
        }

        return forSale;
    }

    // buy an article
    function buyArticle(uint256 _id) public payable {
        // we check whether there is an article for sale
        require(articleCounter > 0, "There should be at least one article");

        // we check that the article exists
        require(
            _id > 0 && _id <= articleCounter,
            "Article with this ID does not exist"
        );

        // retreive the article from the mapping
        Article storage article = articles[_id];

        // we check that the article has not been sold yet
        require(article.buyer == address(0), "Article was already sold");

        // we don't allow the seller to buy his own article
        require(
            msg.sender != article.seller,
            "Seller cannot buy its own article"
        );

        // we check that the value sent corresponds to the price of the article
        require(
            msg.value == article.price,
            "Value provided does not match price of article"
        );

        // keep buyer's information
        article.buyer = msg.sender;

        // the buyer can pay the seller
        article.seller.transfer(msg.value);

        // trigger the event
        emit LogBuyArticle(
            _id,
            article.seller,
            article.buyer,
            article.name,
            article.price
        );
    }
}
