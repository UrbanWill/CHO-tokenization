import React, { useEffect, useState, useCallback } from "react";

const TokenCounter = ({ accounts, onTransferEvent, onBalanceOf }) => {
  const [userTokens, setUserTokens] = useState(0);

  const updateUserTokens = useCallback(async () => {
    const tokenQuantity = await onBalanceOf(accounts[0]).call();
    setUserTokens(tokenQuantity);
  }, [accounts, onBalanceOf, setUserTokens]);

  const listenToTokenTransfer = useCallback(async () => {
    onTransferEvent({ filter: { to: accounts[0] } }).on(
      "data",
      updateUserTokens
    );
  }, [onTransferEvent, accounts, updateUserTokens]);

  useEffect(() => {
    if (accounts[0]) {
      updateUserTokens();
      listenToTokenTransfer();
    }
  }, [accounts, listenToTokenTransfer, updateUserTokens]);

  return (
    <div>
      <p>You have: {userTokens} CHO tokens</p>
    </div>
  );
};

export default TokenCounter;
