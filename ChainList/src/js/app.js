App = {
     web3Provider: null,
     contracts: {},
     account: 0x0,

     init: function() {
      

          return App.initWeb3();
     },

     initWeb3: function() {
          //initialize web 3
          if(typeof web3 !== "undefined") {
               // reuse the provider of web3 object injected by Metamask
               App.web3Provider = web3.currentProvider;
          } else {
               //create a new provider and plug it directly into our local node
               App.web3Provider = new Web3.providers.HttpProvider(
                    "http://localhost:7545"
               )
          }
          web3 = new Web3(App.web3Provider);

          App.displayAccountInfo();

          return App.initContract();
     },

     displayAccountInfo: function() {
          web3.eth.getCoinbase(function(err, account) {
               if(err === null) {
                    App.account = account;
                    $("#account").text(account);
                    web3.eth.getBalance(account, function(err, balance) {
                         if(err === null) {
                              $("#accountBalance").text(web3.fromWei(balance, "ether") + "ETH" );
                         }
                    })
               }
          })
     },

     initContract: function() {
          /*
           * Replace me...
           */
     },
};

$(function() {
     $(window).load(function() {
          App.init();
     });
});
