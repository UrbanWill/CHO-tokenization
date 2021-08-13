import React, { useEffect, useState } from "react";

const TokenCounter = ({ accounts, onTransferEvent, onBalanceOf }) => {
  const [userTokens, setUserTokens] = useState(0);

  const updateUserTokens = async () => {
    const tokenQuantity = await onBalanceOf(accounts[0]).call();
    setUserTokens(tokenQuantity);
  };

  const listenToTokenTransfer = async () => {
    onTransferEvent({ filter: { to: accounts[0] } }).on(
      "data",
      updateUserTokens
    );
  };

  useEffect(() => {
    if (accounts[0]) {
      updateUserTokens();
      listenToTokenTransfer();
    }
  }, [accounts[0]]);

  return (
    <div>
      <p>You have: {userTokens} CHO tokens</p>
    </div>
  );
};

export default TokenCounter;
