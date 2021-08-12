import React, { Component } from "react";
import MyToken from "./contracts/MyToken.json";
import MyTokenSale from "./contracts/MyTokenSale.json";
import KycContract from "./contracts/KycContract.json";
import getWeb3 from "./getWeb3";

import Whitelist from "./components/whitelist/Whitelist";
import BuyToken from "./components/buyToken/BuyToken";

import "./App.css";

class App extends Component {
  state = {
    loaded: false,
    userTokens: 0,
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.getChainId();
      this.myToken = new this.web3.eth.Contract(
        MyToken.abi,
        MyToken.networks[this.networkId] &&
          MyToken.networks[this.networkId].address
      );

      this.myTokenSale = new this.web3.eth.Contract(
        MyTokenSale.abi,
        MyTokenSale.networks[this.networkId] &&
          MyTokenSale.networks[this.networkId].address
      );

      this.kycContract = new this.web3.eth.Contract(
        KycContract.abi,
        KycContract.networks[this.networkId] &&
          KycContract.networks[this.networkId].address
      );

      this.listenToTokenTransfer();
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState(
        {
          loaded: true,
        },
        this.updateUserTokens
      );
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  updateUserTokens = async () => {
    let userTokens = await this.myToken.methods
      .balanceOf(this.accounts[0])
      .call();
    this.setState({ userTokens: userTokens });
  };

  listenToTokenTransfer = async () => {
    this.myToken.events
      .Transfer({ to: this.accounts[0] })
      .on("data", this.updateUserTokens);
  };

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Chourico Token</h1>
        <Whitelist
          accounts={this.accounts}
          setKycCompleted={this.kycContract.methods.setKycCompleted}
        />
        <p>You have: {this.state.userTokens} CHO tokens</p>
        <BuyToken
          accounts={this.accounts}
          buyTokens={this.myTokenSale.methods.buyTokens}
        />
      </div>
    );
  }
}

export default App;
