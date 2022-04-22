var Dark = artifacts.require("./Dark.sol");

contract("Dark", function(accounts) {
  var darkInstance;

  it("checkInitilizedCommentCount", function(){
    return Dark.deployed().then(function(instance){
      return instance.numOfComments()
    }).then(function(count){
      assert.equal(count, 0)
    })
  })

  it("checkInitilizedPostCount", function(){
    return Dark.deployed().then(function(instance){
      return instance.numOfPosts()
    }).then(function(count){
      assert.equal(count, 0)
    })
  })

});