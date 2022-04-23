var Dark = artifacts.require("./Dark.sol");

contract("Dark", function (accounts) {
  let darkInstance;

  it("checkInitilizedCommentCount", function () {
    return Dark.deployed().then(function (instance) {
      return instance.numOfComments()
    }).then(function (count) {
      assert.equal(count, 0)
    })
  })

  it("checkInitilizedPostCount", function () {
    return Dark.deployed().then(function (instance) {
      return instance.numOfPosts()
    }).then(function (count) {
      assert.equal(count, 0)
    })
  })

  let firstPostText = "Hello World"
  it("createFirstPost", function () {
    return Dark.deployed().then(function (instance) {
      darkInstance = instance
      return darkInstance.createNewPost(firstPostText, { from: accounts[0] })
    }).then(function (receipt) {
      assert(darkInstance.numOfPosts.call(), 1)
      return darkInstance.getPost.call(0)
    }).then(function (post) {
      expect(post.userID).equal(accounts[0])
      assert(post.text, firstPostText)
    })
  })

  let firstCommentText = "It's amazing:)"
  postID = 0

  it("createFirstComment", function () {
    return Dark.deployed().then(function (instance) {
      darkInstance = instance
      return darkInstance.createNewComment(postID, firstCommentText, { from: accounts[0] })
    }).then(function (receipt) {
      assert(darkInstance.numOfComments.call(), 1)
      return darkInstance.getComment.call(0)
    }).then(function (c) {
      assert(c.text, firstCommentText)
    })
  })


  c1 = "good"
  c2 = "great"
  c3 = "amazing"

  it("Add more comments to the first post", function () {
    return Dark.deployed().then(function (instance) {
      darkInstance = instance
      return darkInstance.createNewComment(postID, c1, { from: accounts[0] })
    }).then(function (receipt) {
      return darkInstance.createNewComment(postID, c2, { from: accounts[0] })
    }).then(function (receipt) {
      return darkInstance.createNewComment(postID, c3, { from: accounts[0] })
    }).then(function (receipt) {
      assert(darkInstance.numOfComments.call(), 4)
    })
  })

  it("Get all comments of the first post", function () {
    return Dark.deployed().then(function (instance) {
      darkInstance = instance
      return darkInstance.post2Comment(postID)
    }).then(function (ptr) {
      return darkInstance.ptr2Comment(ptr)
    }).then(function (_c0) {
      assert(_c0.text, firstCommentText)
      return darkInstance.ptr2Comment(_c0.next)
    }).then(function (_c1) {
      assert(_c1.text, c1)
      return darkInstance.ptr2Comment(_c1.next)
    }).then(function (_c2) {
      assert(_c2.text, c2)
      return darkInstance.ptr2Comment(_c2.next)
    }).then(function (_c3) {
      assert(_c3.text, c3)
      assert(_c3.next, 0)
    })
  })

  it("Get all posts of the user", function () {
    return Dark.deployed().then(function (instance) {
      darkInstance = instance
      return darkInstance.user2Post(accounts[0])
    }).then(function (ptr) {
      return darkInstance.ptr2Post(ptr)
    }).then(function (post) {
      expect(post.userID).equal(accounts[0])
      expect(post.text).equal(firstPostText)
      assert(post.next, 0)
    })
  })
})