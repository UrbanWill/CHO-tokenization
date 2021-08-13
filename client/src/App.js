import React, { useState, useEffect, useCallback } from "react";
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

  const getAccounts = useCallback(async () => {
    const web3Accounts = await web3.eth.getAccounts();
    setAccounts(web3Accounts);
  }, [web3]);

  const listenMMAccount = useCallback(async () => {
    window.ethereum.on("accountsChanged", async () => {
      getAccounts();
    });
  }, [getAccounts]);

  const connectToWeb3 = useCallback(async () => {
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

    await getAccounts();
    setKycContract(kycContractInstance);
    setMyTokenSale(myTokenSaleInstance);
    setMyToken(myTokenInstance);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    connectToWeb3();
    listenMMAccount();
  }, [connectToWeb3, listenMMAccount]);

  if (!isLoaded) {
    return <div>Loading Web3, accounts, contracts...</div>;
  }

  return (
    <div className="App">
      <h1>Chourico Token</h1>
      <Whitelist
        accounts={accounts}
        onSetKycCompleted={kycContract.methods.setKycCompleted}
      />
      <TokenCounter
        accounts={accounts}
        myToken={myToken}
        onBalanceOf={myToken.methods.balanceOf}
        onTransferEvent={myToken.events.Transfer}
      />
      <BuyToken
        accounts={accounts}
        onBuyTokens={myTokenSale.methods.buyTokens}
      />
    </div>
  );
};

export default App;
