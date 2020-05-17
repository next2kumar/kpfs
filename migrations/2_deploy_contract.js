const Doc = artifacts.require("Doc");
const Meme = artifacts.require("Meme");

module.exports = function(deployer) {
  deployer.deploy(Doc);
  deployer.deploy(Meme);
};
