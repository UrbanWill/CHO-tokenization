import React, { useState, useEffect } from "react";
import MyToken from "./contracts/MyToken.json";
import MyTokenSale from "./contracts/MyTokenSale.json";
import KycContract from "./contracts/KycContract.json";
import getWeb3 from "./getWeb3";

import Whitelist from "./components/whitelist/Whitelist";
import BuyToken from "./components/buyToken/BuyToken";
import TokenCounter from "./components/tokenCounter/TokenCounter";

import "./App.css";

const App = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [myToken, setMyToken] = useState(null);
  const [myTokenSale, setMyTokenSale] = useState(null);
  const [kycContract, setKycContract] = useState(null);

  let web3;

  const getAccounts = async () => {
    const web3Accounts = await web3.eth.getAccounts();
    setAccounts(web3Accounts);
  };

  const listenMMAccount = async () => {
    window.ethereum.on("accountsChanged", async () => {
      getAccounts();
    });
  };

  const connectToWeb3 = async () => {
    web3 = await getWeb3();
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

    getAccounts();
    setKycContract(kycContractInstance);
    setMyTokenSale(myTokenSaleInstance);
    setMyToken(myTokenInstance);
    setIsLoaded(true);
  };

  useEffect(() => {
    connectToWeb3();
    listenMMAccount();
  }, []);

  if (!isLoaded || !accounts[0]) {
    return <div>Loading Web3...</div>;
  }

  return (
    <div className="App">
      <h1>Chourico Token</h1>
      <Whitelist
        accounts={accounts}
        setKycCompleted={kycContract.methods.setKycCompleted}
      />
      <TokenCounter accounts={accounts} myToken={myToken} />
      <BuyToken accounts={accounts} buyTokens={myTokenSale.methods.buyTokens} />
    </div>
  );
};

export default App;
