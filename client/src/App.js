import React, { Component } from "react";
import getWeb3 from "./getWeb3";
import "./App.css";
import DarkContract from "./contracts/Dark.json";
import styles from './styles/main.module.css'

class App extends Component {
  state = { allposts: {}, web3: null, accounts: null, contract: null, newpost: '', numOfPost: 0, addComments: {}, newComments: {} };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAccountId = this.handleAccountId.bind(this);
    this.handleTimestamp = this.handleTimestamp.bind(this);
    this.getAllCommentsByPost = this.getAllCommentsByPost.bind(this);
  }

  handleChange(event) {
    this.setState({ newpost: event.target.value })
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const { contract, newpost, accounts, allposts } = this.state;
    if (newpost != '') {
      await contract.methods.createNewPost(newpost).send({ from: accounts[0] });
      this.setState({ newpost: '' });
      this.updatePost();
    } else {
      alert('The post cannot be blank!');
    }
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = DarkContract.networks[networkId];
      const instance = new web3.eth.Contract(
        DarkContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      instance.options.address = "";// Fill the contract address

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.updatePost);

      const { addComments } = this.state;

      for (let i = this.state.numOfPost - 1; i > -1; i--) {
        addComments[i] = false;
      }
      this.setState({ addComments: addComments })

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  handleAccountId = (account) => {
    let tmp = String(account);
    return tmp.substring(0, 6) + "..." + tmp.substring(tmp.length - 4)
  }

  handleTimestamp = (timestamp) => {
    let date = new Date(timestamp * 1000);
    let month = ('0' + (date.getMonth() + 1)).substr(- 2)
    let day = ('0' + date.getDate()).substr(-2)
    let hour = ('0' + date.getHours()).substr(-2)
    let minute = ('0' + date.getMinutes()).substr(-2)
    let second = ('0' + date.getSeconds()).substr(-2)
    return month +
      "/" + day +
      "/" + date.getFullYear() +
      "  " + hour +
      ":" + minute + ':' + second
  }

  updatePost = async () => {
    const { contract } = this.state;
    const numPosts = await contract.methods.numOfPosts().call();
    this.setState({ numOfPost: numPosts })
    let allPosts = {};
    let tmppost = {};
    for (let i = numPosts - 1; i > -1; i--) {
      tmppost = await contract.methods.getPost(i).call();
      tmppost = { ...tmppost };
      tmppost.comments = await this.getAllCommentsByPost(tmppost.postID);
      allPosts[tmppost.postID] = tmppost;
    }
    this.setState({ allposts: allPosts });
  };

  getAllCommentsByPost = async (postID) => {
    const { contract } = this.state;
    let header = await contract.methods.post2Comment(postID).call();
    let comments = [];
    let curr_comment = 0;
    while (header != 0) {
      curr_comment = await contract.methods.ptr2Comment(header).call();
      comments.push(curr_comment);
      header = curr_comment.next;
    }
    return comments;
  }
  handleSubmitComment = async (event, postID) => {
    event.preventDefault();
    console.log(postID);
    const { contract, accounts, newComments, addComments } = this.state;
    if (newComments[postID] != '') {
      await contract.methods.createNewComment(postID, newComments[postID]).send({ from: accounts[0] });
      this.updatePost();
      addComments[postID] = false;
      newComments[postID] = '';
      this.setState({ addComments: addComments, newComments: newComments })
    } else {
      alert('The comment cannot be blank!');
    }
  }

  handleChangeComment = (event, postID) => {
    const { newComments } = this.state;
    newComments[postID] = event.target.value;
    this.setState({ newComments: newComments })
  }

  // render() {
  //   if (!this.state.web3) {
  //     return <div>Loading Web3, accounts, and contract...</div>;
  //   }
  //   return (
  //     <>
  //       <Router>
  //         <Routes>
  //           <Route exact path='/' element={<MainPage />} />
  //           <Route exact path='/posts/new' element={<NewPostPage />} />
  //           <Route exact path='/posts/:postid' element={<PostDetailPage />} />
  //           <Route exact path='/posts' element={<PostPage />} />
  //         </Routes>
  //       </Router>
  //     </>
  //   );
  // }
  render() {
    if (!this.state.web3) {
      return <div className={styles.container}>
        <div>Loading Web3, accounts, and contract...</div>
      </div >
    }
    return (
      <>
        <div className={styles.container}>
          <h1 className={styles.header1}><span style={{ color: 'grey' }}>Dark</span> Posts</h1>
          <form onSubmit={this.handleSubmit} className={styles.formDiv}>
            <label >
              <span className={styles.inputLabel}>
                Add A New Post
              </span>
            </label>
            <div className={styles.userId}>
              <span style={{ color: 'grey' }}>User: </span>{this.handleAccountId(this.state.accounts[0])}
            </div>
            <div className={styles.inputDivSecondLine}>
              <textarea placeholder='Post a message.' type='text' onChange={this.handleChange} className={styles.inputDiv} value={this.state.newpost}>
              </textarea>
              <button className={styles.submitButton}>Submit</button>
            </div>
          </form>
          <div className={styles.allpostContainer}>
            {Object.keys(this.state.allposts).sort((a, b) => (b - a)).map((key, index) => {
              const post = this.state.allposts[key];
              return (
                <div className={styles.postContainer}>
                  <div className={styles.id}>
                    <div>
                      <span style={{ color: 'grey' }}>User: </span>{this.handleAccountId(post.userID)}
                    </div>
                    <div style={{ color: 'grey' }}>
                      {this.handleTimestamp(post.timestamp)}
                    </div>
                  </div>
                  <div className={styles.postcontent}>{post.text}</div>
                  <div onClick={() => {
                    const { addComments } = this.state;
                    addComments[key] = !addComments[key]
                    this.setState(addComments);
                  }} className={styles.addCommentClick}>Add Comments</div>
                  {this.state.addComments[key] ? <div className={styles.addCommentInputDiv}>
                    <form onSubmit={(event) => this.handleSubmitComment(event, key)} className={styles.commentFormDiv} style={{ width: '700px' }}>
                      <div className={styles.id}>
                        <div>
                          <span style={{ color: 'grey' }}>User: </span>{this.handleAccountId(this.state.accounts[0])}
                        </div>
                      </div>
                      <div className={styles.inputDivSecondLine}>
                        <textarea placeholder='Add your comments.' type='text' onChange={(event) => this.handleChangeComment(event, key)} className={styles.inputDiv} value={this.state.newComments[key]}>
                        </textarea>
                        <button className={styles.submitButton}>Submit</button>
                      </div>
                    </form>
                  </div> : null}
                  <div className={styles.commentContainer}>
                    {post.comments.map((c) => {
                      return (
                        <div className={styles.commentDiv}>
                          <div className={styles.id} style={{ paddingRight: 0 }}>
                            <div>
                              <span style={{ color: 'grey' }}>User: </span>{this.handleAccountId(post.userID)}
                            </div>
                            <div style={{ color: 'grey' }}>
                              {this.handleTimestamp(c.timestamp)}
                            </div>
                          </div>
                          <div className={styles.comment}>{c.text}</div>
                        </div>);
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </>
    )
  }
}

export default App;
