lApp = {
     web3Provider: null,
     contracts: {},
     account: 0x0,
     loading: false,
   
     init: async () => {
       return App.initWeb3();
     },
   
     initWeb3: async () => {
        if(window.ethereum) {
          window.web3 = new Web3(window.ethereum);
          try {
            await window.ethereum.enable();
            App.displayAccountInfo();
            return App.initContract();
          } catch(error) {
            // user denied access
            console.error("Unable to retrieve your accounts! You have to approve this application on Metamask")
          }
        } else if (window.web3) {
          window.web3 = new Web3(web3.currentProvider || "ws://localhost:8545")
          App.displayAccountInfo();
          return app.initContract();
        } else {
          console.log("non-ethereum browser detected. You should consider trying Metamask.")
        }
     },
   
     displayAccountInfo: async () => {
       const accounts = await window.web3.eth.getAccounts();
       App.account = accounts[0];
       $("#account").text(App.account);
       const balance = await window.web3.eth.getBalance(App.account);
       $("#accountBalance").text(window.web3.utils.fromWei(balance, "ether") + " ETH")
     },
   
     initContract: async () => {
       $.getJSON('ChainList.json', (chainListArtifact) => { 
          App.contracts.ChainList = TruffleContract(chainListArtifact)
          App.contracts.ChainList.setProvider(window.web3.currentProvider)
          App.listenToEvents();
          return App.reloadArticles();
       });
     },

         // listen to events triggered by the contract
    listenToEvents: async () => {
        const chainListInstance = await App.contract.ChainList.deployed();
        if (App.logSellArticleEventListener == null) {
          App.logSellArticleEventListener = chainListInstance
            .LogSellArticle({fromBlock: "0"})
            .on("data", event => {
              $("#" + event.id).remove();
              $("#events").append('<li class ="list-group-item" id="">' + event.id + '">"' + event.returnValues._name + ' is for sale</li>')
              App.reloadArticles();
            })
            .on("error", error => {
              console.error(error);
            })
        }
        if (App.logBuyArticleEventListener == null) {
          App.logBuyArticleEventListener = chainListInstance
            .LogBuyArticle({fromBlock: "0"})
            .on("data", event => {
              $("#" + event.id).remove();
              $("#events").append('<li class ="list-group-item" id="">' + event.id + '">"' + event.returnValues._buyer + ' bought ' + event.returnValues._name  + '</li>')
              App.reloadArticles();
            })
            .on("error", error => {
              console.error(error);
            })
        }

        $('.btn-subscribe').hide();
        $('.btn-unsubscribe').show();
        $('.btn-show-events').show();

    },
   
     reloadArticles: function() {
       // avoid reentry 
       if(App.loading) {
         return;
       }

       App.loading = true;

       // refresh account information because the balance might have changed
       App.displayAccountInfo();
   
       // local variable to store the instance of the chainlist contract
       var chainListInstance;

       App.contracts.ChainList.deployed().then(function(instance) {
         chainListInstance = instance
         return chainListInstance.getArticlesForSale();
       }).then(function(articleIds) {
        $('#articlesRow').empty();

        for(var i = 0; i < articleIds.length; i++) {
          var articleId = articleIds[i];
          chainListInstance.articles(articleId.toNumber()).then(function(article) {
            App.displayArticle(article[0], article[1], article[3], article[4], article[5])
          })
        }

        App.loading = false;
   
       }).catch(function(err) {
         console.error(err.message);
         App.loading = false;
       });
     },

     displayArticle: function(id, seller, name, description, price) {
        var articlesRow = $('#articlesRow');

        var etherPrice = web3.fromWei(price, "ether")

        var articleTemplate = $('#articleTemplate');

        articleTemplate.find('.panel-title').text(name);
        articleTemplate.find('.article-description').text(description);
        articleTemplate.find('.article-price').text(etherPrice + " ETH");
        articleTemplate.find('.btn-buy').attr("data-id", id);
        articleTemplate.find('.btn-buy').attr("data-value", etherPrice);

        if (seller == App.account) {
          articleTemplate.find('.article-seller').text("You");
          articleTemplate.find('.btn-buy').hide();
        } else {
          articleTemplate.find('.article-seller').text(seller);
          articleTemplate.find('.btn-buy').show();
        }

        articlesRow.append(articleTemplate.html());
     },
   
     sellArticle: function() {
       // retrieve the detail of the article
       var _article_name = $('#article_name').val();
       var _description = $('#article_description').val();
       var _price = web3.toWei(parseFloat($('#article_price').val() || 0), "ether");
   
       if((_article_name.trim() == '') || (_price == 0)) {
         // nothing to sell
         return false;
       }
   
       App.contracts.ChainList.deployed().then(function(instance) {
         return instance.sellArticle(_article_name, _description, _price, {
           from: App.account,
           gas: 500000
         });
       }).then(function(result) {
   
       }).catch(function(err) {
         console.error(err);
       });
     },
   
 
   
     buyArticle: function() {
       event.preventDefault();
   
       // retrieve the article price
       var _articleId = $(event.target).data("id");
       var _price = parseFloat($(event.target).data('value'));
   
       App.contracts.ChainList.deployed().then(function(instance){
         return instance.buyArticle(_articleId, {
           from: App.account,
           value: web3.toWei(_price, "ether"),
           gas: 500000
         });
       }).catch(function(error) {
         console.error(error);
       });
     }
   };
   
   $(function() {
     $(window).load(function() {
       App.init();
     });
   });
   