import React, { Component } from "react";
import getWeb3 from "./getWeb3";
import "./App.css";
import DarkContract from "./contracts/Dark.json";
import styles from './styles/main.module.css'
import Mcp from "./mcp"
import './bootstrap.css';
// import Logo from "./logo.jpg" 
import Logo from "./logo.svg"
import { Comment, Tooltip, Avatar, Button, Divider } from 'antd';
import { UserOutlined,DislikeOutlined, LikeOutlined, DislikeFilled, LikeFilled } from '@ant-design/icons';

class App extends Component {
  state = { allposts: {}, web3: null, provider: null, accounts: null, contract: null, newpost: '', numOfPost: 0, addComments: {}, newComments: {} };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAccountId = this.handleAccountId.bind(this);
    this.handleTimestamp = this.handleTimestamp.bind(this);
    this.getAllCommentsByPost = this.getAllCommentsByPost.bind(this);
    this.updateProvider = this.updateProvider.bind(this);
  }

  handleChange(event) {
    this.setState({ newpost: event.target.value })
  }

  handleSubmit = async (event) => {
    await this.updateProvider();
    event.preventDefault();
    const { contract, newpost, accounts, allposts } = this.state;
    if (newpost != '') {
      await contract.methods.createNewPost(newpost).sendToBlock({ from: accounts[0], amount: "0" });
      this.setState({ newpost: '' });
      this.updatePost();
    } else {
      alert('The post cannot be blank!');
    }
  }

  updateProvider = async () => {
    if (typeof window["aleereum"] == "undefined") {
      alert("Please install Ale Wallet!")
    }
    if (!this.state.provider || !this.state.provider.isConnected){
    const provider = window.aleereum
    await provider.connect()

    const accounts = [provider.account,]
    this.setState({provider, accounts})
    }
  }

  componentDidMount = async () => {
    try {
      const abi = require("./abi.json");
      const McpFunc = new Mcp();
      McpFunc.Contract.setProvider("http://13.212.177.203:8765") //http://18.182.45.18:8765");
      const tokenAddress = "0xa9DDe3026edE84b767205492Eef2944E1FC3a0B8";
      const instance = new McpFunc.Contract(
          abi,
          tokenAddress
      );

 
      this.setState({contract: instance }, this.updatePost);

 
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
    console.log("numofPosts", numPosts);
    this.setState({ numOfPost: numPosts });
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
    await this.updateProvider();
    event.preventDefault();
    console.log(postID);
    const { contract, accounts, newComments, addComments } = this.state;
    if (newComments[postID] != '') {
      await contract.methods.createNewComment(postID, newComments[postID]).sendToBlock({ from: accounts[0], amount: "0" });
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

  render() {
    // if (!this.state.provider || !this.state.provider.isConnected) {
    //   return <div className={styles.container}>
    //     <div>Loading Web3, accounts, and contract...</div>
    //   </div >
    // }
    return (
      <>
      <header >
                <nav  style={{position:"fixed", width:"100%"}} className='navbar navbar-expand-md navbar-dark bg-dark'><img style={{height: "50px"}} src="logo.jpg"></img></nav>
        </header>
        <div className={styles.container}>
          <h1 className={styles.header1}><span style={{ color: 'grey' }}>Dark</span> Posts</h1>
          <form onSubmit={this.handleSubmit} className={styles.formDiv}>
            <label >
              <span className={styles.inputLabel}>
                Add A New Post
              </span>
            </label>
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
                    <div className={styles.idAndAva}>
                      <div style={{width:"50px", background:'white',borderRadius:"50%",overflow:'hidden'}}>
                      <Avatar src= {"https://joeschmoe.io/api/v1/"+post.userID} alt={this.handleAccountId(post.userID)} />
                      </div>
                      <div style={{marginLeft:'10px'}}><span style={{ color: 'grey' }}>User:</span>{this.handleAccountId(post.userID)}</div>
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
                    <form onSubmit={(event) => this.handleSubmitComment(event, key)} className={styles.commentFormDiv} style={{ width: '650px' }}>
                      <div className={styles.inputDivSecondLine2}>
                        <textarea placeholder='Add your comments.' type='text' onChange={(event) => this.handleChangeComment(event, key)} className={styles.inputDiv2} value={this.state.newComments[key]}>
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
                            <div className={styles.idAndAva}>
                              <div style={{width:"30px", background:'white',borderRadius:"50%",overflow:'hidden'}}>
                              <Avatar src= {"https://joeschmoe.io/api/v1/"+c.userID} alt={"User's avatar"} />
                              </div>
                              <span style={{ marginLeft: "5px", color: 'grey' }}>User: </span>{this.handleAccountId(c.userID)}
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
