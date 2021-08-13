import React, { useEffect, useState } from "react";

const TokenCounter = ({ accounts, myToken }) => {
  const [userTokens, setUserTokens] = useState(0);

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

  return (
    <div>
      <p>You have: {userTokens} CHO tokens</p>
    </div>
  );
};

export default TokenCounter;
