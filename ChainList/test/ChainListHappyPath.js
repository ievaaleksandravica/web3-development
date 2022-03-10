// loading the ChainList contract and wrapping in Truffle abstraction
var ChainList = artifacts.require("./ChainList.sol");

//test suite
contract("ChainList", function(accounts) {
    var chainListInstance;
    var seller = accounts[1];
    var buyer = accounts[2];
    var articleName = "article1";
    var articleDescription = "Description for Article 1";
    var articlePrice = 10;
    var sellerBalanceBeforeBuy, sellerBalanceAfterBuy;
    var buyerBalanceBeforeBuy, buyerBalanceAfterBuy;


    it("should be initialized with empty values", function(){
        return ChainList.deployed().then(function(instance) {
            return instance.getArticle();
        }).then(function(data) {
            assert.equal(data[0], 0x0, "seller must be empty");
            assert.equal(data[1], "", "article name must be empty");
            assert.equal(data[2], "", "article description must be empty");
            assert.equal(data[3].toNumber(), 0, "article price must be zero");
        })
    });

    it("should sell an article", function() {
        return ChainList.deployed().then(function(instance) {
            chainListInstance = instance;
            return chainListInstance.sellArticle(articleName, articleDescription, web3.toWei(articlePrice, "ether"), {from: seller})
        }).then(function() {
            return chainListInstance.getArticle();
        }).then(function(data) {
            assert.equal(data[0], seller, "seller must be  " + seller);
            assert.equal(data[1], articleName, "article name must be " + articleName);
            assert.equal(data[2], articleDescription, "article description must be " + articleDescription);
            assert.equal(data[3].toNumber(), web3.toWei(articlePrice, "ether"), "article price must be " + web3.toWei(articlePrice, "ether"));
        })
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
