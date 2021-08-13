import React, { useState, useEffect } from "react";
import MyToken from "./contracts/MyToken.json";
import MyTokenSale from "./contracts/MyTokenSale.json";
import KycContract from "./contracts/KycContract.json";
import getWeb3 from "./getWeb3";

import Whitelist from "./components/whitelist/Whitelist";
import BuyToken from "./components/buyToken/BuyToken";

import "./App.css";

const App = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [userTokens, setUserTokens] = useState(0);
  const [accounts, setAccounts] = useState([]);
  const [myToken, setMyToken] = useState(null);
  const [myTokenSale, setMyTokenSale] = useState(null);
  const [kycContract, setKycContract] = useState(null);

  let web3;

  const connectToWeb3 = async () => {
    web3 = await getWeb3();
    setAccounts(await web3.eth.getAccounts());
    const networkId = await web3.eth.getChainId();

    const myTokenInstance = new web3.eth.Contract(
      MyToken.abi,
      MyToken.networks[networkId] && MyToken.networks[networkId].address
    );

    const myTokenSaleInstance = new web3.eth.Contract(
      MyTokenSale.abi,
      MyTokenSale.networks[networkId] && MyTokenSale.networks[networkId].address
    );

    const kycContractInstance = new web3.eth.Contract(
      KycContract.abi,
      KycContract.networks[networkId] && KycContract.networks[networkId].address
    );

    setKycContract(kycContractInstance);
    setMyTokenSale(myTokenSaleInstance);
    setMyToken(myTokenInstance);
    setIsLoaded(true);
  };

  useEffect(() => {
    connectToWeb3();
  }, []);

  const updateUserTokens = async () => {
    const tokenQuantity = await myToken.methods.balanceOf(accounts[0]).call();
    setUserTokens(tokenQuantity);
  };

  const listenToTokenTransfer = async () => {
    myToken.events.Transfer({ to: accounts[0] }).on("data", updateUserTokens);
  };

  useEffect(() => {
    if (myToken && accounts[0]) {
      updateUserTokens();
      listenToTokenTransfer();
    }
  }, [myToken, accounts[0]]);

  if (!isLoaded) {
    return <div>Loading Web3, accounts, and contract...</div>;
  }

  return (
    <div className="App">
      <h1>Chourico Token</h1>
      <Whitelist
        accounts={accounts}
        setKycCompleted={kycContract.methods.setKycCompleted}
      />
      <p>You have: {userTokens} CHO tokens</p>
      <BuyToken accounts={accounts} buyTokens={myTokenSale.methods.buyTokens} />
    </div>
  );
};

export default App;
