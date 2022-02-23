App = {
     web3Provider: null,
     contracts: {},

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
