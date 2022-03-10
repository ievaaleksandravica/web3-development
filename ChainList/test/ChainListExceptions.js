// load the contract to be tested
var ChainList = artifacts.require("./ChainList.sol")

// test suite
contract("Chainlist", function(accounts) {
    var chainListInstance;
    var seller = accounts[1];
    var articleName = "article 1";
    var articleDescription = "Description for Article 1";
    var articlePrice = 10;

    // no article for sale yet
    it("should throw an exception if you try to buy an article when there is no article for sale yet", function() {
        return ChainList.deployed().then(function(instance) {
            chainListInstance = instance;
            return chainListInstance.buyArticle({
                from: buyer,
                value: web3.toWei(articlePrice, "ether")
            })
            .then(assert.fail)
            .catch(function(error) {
                assert(true)
            })
        })
    })


});