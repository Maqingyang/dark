import React, { Component } from "react";
import { useEffect, useState } from 'react';
import "./App.css";
import DarkContract from "./contracts/Dark.json";
import styles from './styles/main.module.css'

//new
import Mcp from 'mcp.js';
import contract from './contract.js';



function App() {
  const [ mcp, setMcp ] = useState(null);
  const networks = {
    "3" : "http://13.212.177.203:8765",
    "4" : "http://18.182.45.18:8765"
  };
  const [currentAccount, setCurrentAccount] = useState(null);
  const [tokens, setTokens] = useState([]);

  const on_networkId_change = (networkId) => {
    const tmp = new Mcp();
    tmp.Contract.setProvider(networks[networkId]);
    setMcp(tmp);
    return tmp
  }

  const initializeWallet = (provider) => {
    provider.on("on_networkId_change", on_networkId_change);

    const mcp = on_networkId_change(provider.networkId);

    console.log("Found account address: ", provider.account);

    setCurrentAccount(provider.account);

    fetchTokens(mcp);
  }

  const checkWalletIsConnected = async () => {
    const { aleereum } = window;

    if (!aleereum || !aleereum.isConnected) {
      console.log("Make sure you have ALE WALLET installed!");
      return;
    } else {
      console.log("Wallet exists! We're ready to go!")
    }

    initializeWallet(aleereum);
  }

  const connectWalletHandler = async () => {
    const { aleereum } = window;

    if (!aleereum) {
      alert("Please install ALE WALLET!");
    }

    try {
      aleereum.connect();

      initializeWallet(aleereum);
    } catch (err) {
      console.log(err)
    }
  }

  const connectWalletButton = () => {
    return (
      <button onClick={connectWalletHandler} className='cta-button connect-wallet-button'>
        Connect Wallet
      </button>
    )
  }
  const fetchTokens = async (provider) => {
    try {
      provider = mcp ? mcp : provider;
      if (!provider) throw "no provider";
      const abi = require("./abi.json");
      const address = "0x1D8b22d407c2b4C0bEdDc4D818AF32948BC3a6B9";
      const Contract = new provider.Contract(abi, address);
    

      console.log(Contract);

     


    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchTokens();

    checkWalletIsConnected();
  }, [])
    return (
     <div>
       <p> hello</p>
       {currentAccount? connectWalletButton():connectWalletButton()}
      </div>

         
      
    )
}

export default App;
