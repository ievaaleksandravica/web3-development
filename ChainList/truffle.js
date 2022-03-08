module.exports = {
     // See <http://truffleframework.com/docs/advanced/configuration>
     // to customize your Truffle configuration!
     networks: {
          ganache: {
               host: "localhost",
               port: 7545,
               network_id: "*" // Match any network id
          },
          chainskills: {
               host: "localhost",
               port: 8545,
               network_id: "4224",
               gas: 47000000,
               from: '0xa6af4272bd0150fbfbd70f569ada4a0a353ebf68'
          }
     }
};
