// loading the ChainList contract and wrapping in Truffle abstraction
var ChainList = artifacts.require("./ChainList.sol");

//test suite
contract("ChainList", function(accounts) {
    var chainListInstance;
    var seller = accounts[1];
    var buyer = accounts[2];
    var articleName1 = "article 1";
    var articleDescription1 = "Description for Article 1";
    var articlePrice1 = 10;
    var articleName2 = "article 2";
    var articleDescription2 = "Description for Article 2";
    var articlePrice1 = 20;
    var sellerBalanceBeforeBuy, sellerBalanceAfterBuy;
    var buyerBalanceBeforeBuy, buyerBalanceAfterBuy;


    it("should be initialized with empty values", function(){
        return ChainList.deployed().then(function(instance) {
            chainListInstance = instance;
            return chainListInstance.getNumberOfArticles();
        }).then(function(data) {
            assert.equal(data.toNumber(), 0, "number of articles must be zero");
            return chainListInstance.getArticlesForSale();
        }).then(function(data) {
            asser.equal(data.length, 0, "there shouldn't be any article for sale")
        })
    });

    // sell a first article
    it("should let us sell a first article", function() {
        return ChainList.deployed().then(function(instance) {
            chainListInstance = instance;
            return chainListInstance.sellArticle(      
                articleName1, 
                articleDescription1,
                web3.toWei(articlePrice1, "ether"), 
                {from: seller});
        }).then(function(receipt) {
            // checking the event
            assert.equal(receipt.logs.length, 1, "one event should have been triggered");
                assert.equal(receipt.logs[0].event, "LogSellArticle", "event should be LogSellArticle");
                assert.equal(receipt.logs[0].args._seller, seller, "event seller must be " + seller);
                assert.equal(receipt.logs[0].args._id.toNumber(), 1, "id must be 1");
                assert.equal(receipt.logs[0].args._name, articleName1, "event seller must be " + articleName1);
                assert.equal(receipt.logs[0].args._price.toNumber(), web3.toWei(articlePrice1, "ether"), "event seller must be " + web3.toWei(articlePrice1, "ether"));
                assert.equal(receipt.logs[0].args._seller, seller, "event seller must be " + seller);
        })
    })

    it("should buy an article", function() {
        return ChainList.deployed().then(function(instance){
            chainListInstance = instance;
            sellerBalanceBeforeBuy = web3.fromWei(web3.eth.getBalance(seller), "ether").toNumber();
            buyerBalanceBeforeBuy = web3.fromWei(web3.eth.getBalance(buyer), "ether").toNumber(); ;
            return chainListInstance.buyArticle({
                from: buyer,
                value: web3.toWei(articlePrice, "ether")
            })
        }).then(function(receipt) {
            assert.equal(receipt.logs.length, 1, "one event should have been triggered");
                assert.equal(receipt.logs[0].event, "LogBuyArticle", "event should be LogBuyArticle");
                assert.equal(receipt.logs[0].args._seller, seller, "event seller must be " + seller);
                assert.equal(receipt.logs[0].args._buyer, buyer, "event seller must be " + buyer);
                assert.equal(receipt.logs[0].args._name, articleName, "event seller must be " + articleName);
                assert.equal(receipt.logs[0].args._price.toNumber(), web3.toWei(articlePrice, "ether"), "event seller must be " + web3.toWei(articlePrice, "ether"));
                assert.equal(receipt.logs[0].args._seller, seller, "event seller must be " + seller);

                // record balances of buyer and seller after the buy
                sellerBalanceAfterBuy = web3.fromWei(web3.eth.getBalance(seller), "ether").toNumber();
                buyerBalanceAfterBuy = web3.fromWei(web3.eth.getBalance(buyer), "ether").toNumber(); ;

                // check the effect of the buy on balances of buyer and seller, accounting for gas
                assert(sellerBalanceAfterBuy == sellerBalanceBeforeBuy + articlePrice, "true", "seller should have earned " + articlePrice + " ETH");
                assert(buyerBalanceAfterBuy <= buyerBalanceBeforeBuy - articlePrice, "buyer should have spent " + articlePrice + " ETH");

                return chainListInstance.getArticle();
        }).then(function(data) {
            assert.equal(data[0], seller, "seller must be  " + seller);
            assert.equal(data[1], buyer, "buyer must be " + + buyer);
            assert.equal(data[2], articleName, "article name must be " + articleName);
            assert.equal(data[3], articleDescription, "article description must be " + articleDescription);
            assert.equal(data[4].toNumber(), web3.toWei(articlePrice, "ether"), "article price must be " + web3.toWei(articlePrice, "ether"));
        });
    });

    it("should trigger an event when a new article is sold", function() {
        return ChainList.deployed().then(function(instance) {
            chainListInstance = instance;
            return chainListInstance.sellArticle(articleName, articleDescription, web3.toWei(articlePrice, "ether"), {from: seller}).then(function(receipt) {
                assert.equal(receipt.logs.length, 1, "one event should have been triggered");
                assert.equal(receipt.logs[0].event, "LogSellArticle", "event should be LogSellArticle");
                assert.equal(receipt.logs[0].args._seller, seller, "event seller must be " + seller);
                assert.equal(receipt.logs[0].args._name, articleName, "event seller must be " + articleName);
                assert.equal(receipt.logs[0].args._price.toNumber(), web3.toWei(articlePrice, "ether"), "event seller must be " + web3.toWei(articlePrice, "ether"));
                assert.equal(receipt.logs[0].args._seller, seller, "event seller must be " + seller);
            })
        })
    })
})
