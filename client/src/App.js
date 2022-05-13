import React, { Component } from "react";
import getWeb3 from "./getWeb3";
import "./App.css";
import DarkContract from "./contracts/Dark.json";
import styles from './styles/main.module.css'
import Mcp from "./mcp";

import 'antd/dist/antd.min.css';
import {SmileTwoTone} from '@ant-design/icons';
import {Layout, Space, Typography, Card, Col, Row, Input, Button, Divider, Tabs, Image} from "antd";

import { Comment, Tooltip, Avatar } from 'antd';
import moment from 'moment';
import { UserOutlined,DislikeOutlined, LikeOutlined, DislikeFilled, LikeFilled } from '@ant-design/icons';
import { HomeOutlined, SettingFilled, SmileOutlined} from '@ant-design/icons';


const { Title } = Typography;
const { Header, Content, Footer } = Layout;


const { TabPane } = Tabs;

function callback(key) {
  console.log(key);
}



class App extends Component {
  state = { allposts: {}, web3: null, provider: null, accounts: null, contract: null, newpost: '', numOfPost: 0, addComments: {}, newComments: {} };

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
      await contract.methods.createNewPost(newpost).sendToBlock({ from: accounts[0], amount: "0" });
      this.setState({ newpost: '' });
      this.updatePost();
    } else {
      alert('The post cannot be blank!');
    }
  }

  componentDidMount = async () => {
    try {
      const abi = require("./abi.json");
      const McpFunc = new Mcp();
      McpFunc.Contract.setProvider("http://18.182.45.18:8765");
      const tokenAddress = "0xa9DDe3026edE84b767205492Eef2944E1FC3a0B8";
      const instance = new McpFunc.Contract(
          abi,
          tokenAddress
      );

      if (typeof window["aleereum"] == "undefined") {
        alert("Please install Ale Wallet Chrome Extension!")
      }

      const provider = window["aleereum"]
      console.log(provider)
      await window["aleereum"].connect()

      const accounts = [provider.account,]
      this.setState({ provider, accounts, contract: instance }, this.updatePost);
 
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
    if (!this.state.provider || !this.state.provider.isConnected) {
      return <div className={styles.container}>
        <div>Loading Web3, accounts, and contract...</div>
      </div >
    }
    return (
      <>
        <Layout>
            <Header style={{
            position: 'fixed',
            zIndex: 1,
            width: '100%',
            backgroundColor: '#1e1e21'
            
          }} >
          <div>
            <a href="#">
              <img id="logo" src='logo.jpg' width="50" height="60"></img>
            </a>
          </div>

          </Header>

          <Content className = {styles.container} style = {{marginTop: 64}}>



          <div className="site-card-wrapper" style = {{marginTop: 64}}>
            <Row gutter={16}>
            <div>
            <a href="#">
              <img id="logo" src='https://ibb.co/mt0b1nt' width="50" height="60"></img>
            </a>
          </div>
            
            
            </Row>
          </div>

        
          <Tabs defaultActiveKey="1" onChange={callback} style = {{marginTop: 100}}>
            <TabPane tab="Home" key="1">
              

            <form onSubmit={this.handleSubmit} className={styles.formDiv} style = {{marginTop: 40}}>
            <div className={styles.userId}>
            <Avatar size = {50}
              style={{
               backgroundColor: '#87d068',
               }}
              icon={<UserOutlined />}/>
              <span style={{ color: 'grey' }}>      User: </span>{this.handleAccountId(this.state.accounts[0])}
            </div>
            <div className={styles.inputDivSecondLine}>
              <textarea placeholder='Whats happening?' type='text' onChange={this.handleChange} className={styles.inputDiv} value={this.state.newpost}>
              </textarea>
            </div>
           

            <Space>
              <HomeOutlined size={50}/>
              <SettingFilled />
              <SmileOutlined />
              <SmileOutlined rotate={180} />

             </ Space> 
           <Divider />
           <div>
              <button className = {styles.submitButton}>POST</button>
           </div>
          </form>



            </TabPane>
            <TabPane tab="Popular" key="2">
              Loading ......
            </TabPane>
            <TabPane tab="Following" key="3">
              You didn't follow anyone
            </TabPane>
          </Tabs>


          <div className={styles.allpostContainer}>
            {Object.keys(this.state.allposts).sort((a, b) => (b - a)).map((key, index) => {
              const post = this.state.allposts[key];
              return(

                <div>

                  <Comment
                  actions = {[
                    <Tooltip key="comment-basic-like" title="Like">
                      <span >
                        <LikeOutlined />
                      </span>
                    </Tooltip>,
                    <Tooltip key="comment-basic-dislike" title="Dislike">
                      <span>
                        <DislikeOutlined />
                      </span>
                    </Tooltip>,
                    <span key="comment-basic-reply-to">Send Message</span>
             
                  ]}
                  author = {this.handleAccountId(post.userID)}
                  avatar={<Avatar src="https://joeschmoe.io/api/v1/random" alt={this.handleAccountId(post.userID)} />}
                  content = {post.text}
                  datetime = {this.handleTimestamp(post.timestamp)}
                  >
                     <Button style = {{float: 'right'}} onClick={() => {
                      const { addComments } = this.state;
                      addComments[key] = !addComments[key]
                      this.setState(addComments);
                    }} className={styles.addCommentClick}>Add Comments</Button>
                 

                 

                  {this.state.addComments[key] ? <div className={styles.addCommentInputDiv}>
                          <form onSubmit={(event) => this.handleSubmitComment(event, key)} className={styles.commentFormDiv} style={{ width: '400px' }}>
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

                   {post.comments.map((c) => {
                      return (
                      

                        <Comment
                        actions = {[
                          <Tooltip key="comment-basic-like" title="Like">
                            <span >
                              <LikeOutlined />
                            </span>
                          </Tooltip>,
                          <Tooltip key="comment-basic-dislike" title="Dislike">
                            <span>
                              <DislikeOutlined />
                            </span>
                          </Tooltip>,
                          <span key="comment-basic-reply-to">Send Message</span>
                   
                        ]}
                        author = {this.handleAccountId(post.userID)}
                        avatar={<Avatar src="https://joeschmoe.io/api/v1/random" alt={this.handleAccountId(post.userID)} />}
                        content = {c.text}
                        datetime = {this.handleTimestamp(c.timestamp)}
                        >
    
                        </Comment>);
                    })}
                     </Comment>
                  <Divider />



                </div>



              )


              
            })}
          </div>
          </Content>
          </Layout>
         
      </>
    )
  }
}

export default App;
