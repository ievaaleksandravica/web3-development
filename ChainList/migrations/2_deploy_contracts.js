var Migrations = artifacts.require("./ChainList.sol");

module.exports = function(deployer) {
  deployer.deploy(ChainList);
};
