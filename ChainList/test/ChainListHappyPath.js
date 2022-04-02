// loading the ChainList contract and wrapping in Truffle abstraction
var ChainList = artifacts.require("./ChainList.sol");

//test suite
contract("ChainList", function(accounts) {
    let chainListInstance;
    const seller = accounts[1];
    const buyer = accounts[2];
    const articleName1 = "article 1";
    const articleDescription1 = "Description for Article 1";
    const articlePrice1 = web3.utils.toBN(10);
    const articleName2 = "article 2";
    const articleDescription2 = "Description for Article 2";
    const articlePrice2 = web3.utils.toBN(20);
    let sellerBalanceBeforeBuy, sellerBalanceAfterBuy;
    let buyerBalanceBeforeBuy, buyerBalanceAfterBuy;


    it("should be initialized with empty values", function(){
        return ChainList.deployed().then(function(instance) {
            chainListInstance = instance;
            return chainListInstance.getNumberOfArticles();
        }).then(function(data) {
            assert.equal(data.toNumber(), 0, "number of articles must be zero");
            return chainListInstance.getArticlesForSale();
        }).then(function(data) {
            assert.equal(data.length, 0, "there shouldn't be any article for sale")
        })
    });

    // sell a first article
    it("should let us sell a first article", function() {
        return ChainList.deployed().then(function(instance) {
            chainListInstance = instance;
            return chainListInstance.sellArticle(      
                articleName1, 
                articleDescription1,
                web3.utils.toWei(articlePrice1, "ether"), 
                {from: seller});
        }).then(function(receipt) {
            // checking the event
            assert.equal(receipt.logs.length, 1, "one event should have been triggered");
                assert.equal(receipt.logs[0].event, "LogSellArticle", "event should be LogSellArticle");
                assert.equal(receipt.logs[0].args._seller, seller, "event seller must be " + seller);
                assert.equal(receipt.logs[0].args._id.toNumber(), 1, "id must be 1");
                assert.equal(receipt.logs[0].args._name, articleName1, "event seller must be " + articleName1);
                assert.equal(receipt.logs[0].args._price.toString(), web3.utils.toWei(articlePrice1, "ether").toString(), "event seller must be " + web3.utils.toWei(articlePrice1, "ether"));
                assert.equal(receipt.logs[0].args._seller, seller, "event seller must be " + seller);

                return chainListInstance.getNumberOfArticles();
        }).then(function(data) {
            assert.equal(data.toNumber(), 1, "number of articles must be one");

            return chainListInstance.getArticlesForSale();
        }).then(function(data) {
            assert.equal(data.length, 1, "there should be one article for sale");
            assert.equal(data[0].toNumber(), 1, "id of article for sale should be one");

            return chainListInstance.articles(data[0])
        }).then(function(data) {
            assert.equal(data[0].toNumber(), 1, "article id must be 1" );
            assert.equal(data[1], seller, "seller must be " + seller );
            assert.equal(data[2], 0x0, "buyer must be empty" );
            assert.equal(data[3], articleName1, "article name must be " + articleName1 );
            assert.equal(data[4], articleDescription1, "article description must be " + articleDescription1 );
            assert.equal(data[5].toString(), web3.utils.toWei(articlePrice1, "ether").toString(), "article price must be " + web3.utils.toWei(articlePrice1, "ether"));
        })
    })

    // sell a second article
    it("should let us sell a second article", function() {
        return ChainList.deployed().then(function(instance) {
            chainListInstance = instance;
            return chainListInstance.sellArticle(      
                articleName2, 
                articleDescription2,
                web3.utils.toWei(articlePrice2, "ether"), 
                {from: seller});
        }).then(function(receipt) {
            // checking the event
            assert.equal(receipt.logs.length, 1, "one event should have been triggered");
                assert.equal(receipt.logs[0].event, "LogSellArticle", "event should be LogSellArticle");
                assert.equal(receipt.logs[0].args._seller, seller, "event seller must be " + seller);
                assert.equal(receipt.logs[0].args._id.toNumber(), 2, "id must be 2");
                assert.equal(receipt.logs[0].args._name, articleName2, "event seller must be " + articleName2);
                assert.equal(receipt.logs[0].args._price.toString(), web3.utils.toWei(articlePrice2, "ether").toString(), "event seller must be " + web3.utils.toWei(articlePrice2, "ether"));
                assert.equal(receipt.logs[0].args._seller, seller, "event seller must be " + seller);

                return chainListInstance.getNumberOfArticles();
        }).then(function(data) {
            assert.equal(data.toNumber(), 2, "number of articles must be two");

            return chainListInstance.getArticlesForSale();
        }).then(function(data) {
            assert.equal(data.length, 2, "there should be two articles for sale");
            assert.equal(data[1].toNumber(), 2, "id of article for sale should be two");

            return chainListInstance.articles(data[1])
        }).then(function(data) {
            assert.equal(data[0].toNumber(), 2, "article id must be 2" );
            assert.equal(data[1], seller, "seller must be " + seller );
            assert.equal(data[2], 0x0, "buyer must be empty" );
            assert.equal(data[3], articleName2, "article name must be " + articleName2 );
            assert.equal(data[4], articleDescription2, "article description must be " + articleDescription2 );
            assert.equal(data[5].toString(), web3.utils.toWei(articlePrice2, "ether").toString(), "article price must be " + web3.utils.toWei(articlePrice2, "ether"));
        })
    })

    // buy the first article
    it("should let us buy the article", async () => {
        const chainListInstance = await ChainList.deployed();
            
        const articleId = 1;

        sellerBalanceBeforeBuy = parseFloat(web3.utils.fromWei(await web3.eth.getBalance(seller), "ether"));
        buyerBalanceBeforeBuy = parseFloat(web3.utils.fromWei(await web3.eth.getBalance(buyer), "ether")); 
           
        
        const receipt = await chainListInstance.buyArticle(1, {
                from: buyer,
                value: web3.utils.toWei(articlePrice1, "ether")
            })
       
        assert.equal(receipt.logs.length, 1, "one event should have been triggered");
        assert.equal(receipt.logs[0].event, "LogBuyArticle", "event should be LogBuyArticle");
        assert.equal(receipt.logs[0].args._id, 1, "article id must be one");
        assert.equal(receipt.logs[0].args._seller, seller, "article seller must be " + seller);
        assert.equal(receipt.logs[0].args._buyer, buyer, "article buyer must be " + buyer);
        assert.equal(receipt.logs[0].args._name, articleName1, "article name must be " + articleName1);
        assert.equal(receipt.logs[0].args._price.toString(), web3.utils.toWei(articlePrice1, "ether").toString(), "article price must be " + web3.utils.toWei(articlePrice1, "ether"));
        assert.equal(receipt.logs[0].args._seller, seller, "event seller must be " + seller);

        // record balances of buyer and seller after the buy
        sellerBalanceAfterBuy = parseFloat(web3.utils.fromWei(await web3.eth.getBalance(seller), "ether"));
        buyerBalanceAfterBuy = parseFloat(web3.utils.fromWei(await web3.eth.getBalance(buyer), "ether"));

        // check the effect of the buy on balances of buyer and seller, accounting for gas
        assert(sellerBalanceAfterBuy == sellerBalanceBeforeBuy + articlePrice1.toNumber(), "true", "seller should have earned " + articlePrice1.toNumber() + " ETH");
        assert(buyerBalanceAfterBuy <= buyerBalanceBeforeBuy - articlePrice1.toNumber(), "buyer should have spent " + articlePrice1.toNumber() + " ETH");

        const article = await chainListInstance.getArticlesForSale();
        
        assert.equal(article.length, 1, "there should now be only one article left for sale");
        assert.equal(article[0].toNumber(), 2, "article 2 should be the only article for sale")

        const data = chainListInstance.getNumberOfArticles()
        assert.equal(data, 2, "there should still be two articles in total");
       
    });

})
