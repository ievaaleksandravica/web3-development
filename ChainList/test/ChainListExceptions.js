// load the contract to be tested
var ChainList = artifacts.require("./ChainList.sol")

// test suite
contract("Chainlist", function(accounts) {
    let chainListInstance;
    const seller = accounts[1];
    const buyer = accounts[2];
    const articleName = "article 1";
    const articleDescription = "Description for Article 1";
    const articlePrice = 10;

    // no article for sale yet
    it("should throw an exception if you try to buy an article when there is no article for sale yet", function() {
        return ChainList.deployed().then(function(instance) {
            chainListInstance = instance;
            return chainListInstance.buyArticle(1, {
                from: buyer,
                value: web3.toWei(articlePrice, "ether")
            })
            .then(assert.fail)
            .catch(function(error) {
                assert(true)
            })
            .then(function() {
                return chainListInstance.getNumberOfArticles();
            })
            .then(function(data) {
                assert.equal(data.toNumber(), 0, "number of articles must be zero");
            })
        })
    });

    // buying an article that does not exist
    it("should throw an exception if you try to buy an article that does not exist", function() {
        ChainList.deployed().then(function(instance) {
           chainListInstance = instance;
           return chainListInstance.sellArticle(articleName, articleDescription, web3.toWei(articlePrice, "ether"), {from: seller});
        }).then(function(receipt) {
            return chainListInstance.buyArticle(2, {from: seller, value: web3.toWei(articlePrice, "ether")})
        })
            .then(assert.fail)
            .catch(function(error) {
                assert(true);
        }).then(function() {
            return chainListInstance.articles(1);
        }).then(function(data) {
            assert.equal(data[0].toNumber(), 1, "article id must be 1" );
            assert.equal(data[1], seller, "seller must be " + seller );
            assert.equal(data[2], 0x0, "buyer must be empty" );
            assert.equal(data[3], articleName, "article name must be " + articleName);
            assert.equal(data[4], articleDescription, "article description must be " + articleDescription );
            assert.equal(data[5].toNumber(), web3.toWei(articlePrice, "ether"), "article price must be " + web3.toWei(articlePrice, "ether"));
        })
    })

    // buying an article you are selling
    it("should throw an exception if you try to buy your own article", function() {
        return ChainList.deployed().then(function(instance) {
            chainListInstance = instance;
            return chainListInstance.buyArticle(1, {
                from: seller,
                value: web3.toWei(articlePrice, "ether")
            })
        })
    
    .then(assert.fail)
    .catch(function(error) {
        assert(true);
    })
    .then(function() {
        return chainListInstance.articles(1);
    })
    .then(function(data) {
        assert.equal(data[0].toNumber(), 1, "article id must be one");
        assert.equal(data[1], seller, "seller must be  " + seller);
        assert.equal(data[2], 0x0, "buyer must be empty");
        assert.equal(data[3], articleName, "article name must be " + articleName);
        assert.equal(data[4], articleDescription, "article description must be " + articleDescription);
        assert.equal(data[5].toNumber(), web3.toWei(articlePrice, "ether"), "article price must be " + web3.toWei(articlePrice, "ether"));
    });

    });

    // buying an article with the wrong value
    it("should throw an exception if you try to buy an article for wrong value", function() {
        return ChainList.deployed().then(function(instance) {
            chainListInstance = instance;
        })
    
    .then(function(receipt) {
        return chainListInstance.buyArticle(1, {
            from: buyer,
            value: web3.toWei(articlePrice + 1, "ether")
        })
    })
    .then(assert.fail)
    .catch(function(error) {
        assert(true);
    })
    .then(function() {
        return chainListInstance.articles(1);
    })
    .then(function(data) {
        assert.equal(data[0].toNumber(), 1, "article id must be one");
        assert.equal(data[1], seller, "seller must be  " + seller);
        assert.equal(data[2], 0x0, "buyer must be empty");
        assert.equal(data[3], articleName, "article name must be " + articleName);
        assert.equal(data[4], articleDescription, "article description must be " + articleDescription);
        assert.equal(data[5].toNumber(), web3.toWei(articlePrice, "ether"), "article price must be " + web3.toWei(articlePrice, "ether"));
    });

    });

     // buying an article that has already been sold
     it("should throw an exception if you try to buy an article that was already sold", function() {
        return ChainList.deployed().then(function(instance) {
            chainListInstance = instance;
        })
        .then(function(receipt) {
        return chainListInstance.buyArticle(1, {
            from: buyer,
            value: web3.toWei(articlePrice, "ether")
        })
    })
    .then(function() {
        return chainListInstance.buyArticle(1, {
            from: web3.eth.accounts[0],
            value: web3.toWei(articlePrice, "ether")
        })
    })
    .then(assert.fail)
    .catch(function(error) {
        assert(true);
    })
    .then(function() {
        return chainListInstance.articles(1);
    })
    .then(function(data) {
        assert.equal(data[0].toNumber(), 1, "article id must be one");
        assert.equal(data[1], seller, "seller must be  " + seller);
        assert.equal(data[2], buyer, "buyer must be " + buyer);
        assert.equal(data[3], articleName, "article name must be " + articleName);
        assert.equal(data[4], articleDescription, "article description must be " + articleDescription);
        assert.equal(data[5].toNumber(), web3.toWei(articlePrice, "ether"), "article price must be " + web3.toWei(articlePrice, "ether"));
    });

    });
});