pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract Dark {
    uint256 public numOfPosts;
    uint256 public numOfComments;

    struct Comment
    {
        bytes32 next; // reference of the next comment of the same postID
        address userID;
        uint256 commentID;
        uint256 timestamp;
        string text;
    }

    struct Post 
    {
        bytes32 next; // referece of the next post of the same userID
        address userID;
        uint256 postID;
        uint256 timestamp;
        bytes32 headOfComment;
        string text;
    }

    // store all post structs
    mapping(bytes32 => Comment) public ptr2Comment;
    // store all comment structs
    mapping(bytes32 => Post) public ptr2Post;

    // all post ptrs by time
    bytes32[] public allPostPtrs;
    // all comment ptrs by time
    bytes32[] public allCommentPtrs;
    // userID -> ptr of the posts
    mapping(address => bytes32) public user2Post;
    // postID -> ptr of the comments
    mapping(uint256 => bytes32) public post2Comment;

    event foo(uint256 count);

    constructor() public {
        numOfComments = 0;
        numOfPosts = 0;
    }

    function createNewPost(string memory text) public {
        Post memory newPost = Post(user2Post[msg.sender], msg.sender, numOfPosts, now, 0, text);
        bytes32 postPtr = keccak256(abi.encodePacked(newPost.userID, newPost.postID, newPost.timestamp, newPost.text));
        ptr2Post[postPtr] = newPost;
        user2Post[msg.sender] = postPtr;
        allPostPtrs.push(postPtr);
        numOfPosts += 1;

    }

    function createNewComment(uint256 postID, string memory text) public {
        Comment memory newComment = Comment(post2Comment[postID], msg.sender, numOfComments, now, text);
        bytes32 commentPtr = keccak256(abi.encodePacked(newComment.userID, newComment.commentID, newComment.timestamp, newComment.text));
        ptr2Comment[commentPtr] = newComment;
        post2Comment[postID] = commentPtr;
        allCommentPtrs.push(commentPtr);
        numOfComments += 1;
    }

    function getPost(uint256 postID) public returns (Post memory post) {
        require( 0 <= postID && postID < numOfPosts);
        bytes32 ptr = allPostPtrs[postID];
        post = ptr2Post[ptr];
    }
    
    function getComment(uint256 commentID) public returns (Comment memory c) {
        require( 0 <= commentID && commentID < numOfComments);
        bytes32 ptr = allCommentPtrs[commentID];
        c = ptr2Comment[ptr];
    }
}

