import React from "react";

const BuyToken = ({ accounts, buyTokens }) => {
  const handleBuyToken = async () => {
    await buyTokens(accounts[0]).send({ from: accounts[0], value: 1 });
  };
  return (
    <div>
      <h2>Buy Chourico-Tokens</h2>
      <button type="button" onClick={handleBuyToken}>
        Buy more CHO tokens
      </button>
    </div>
  );
};

export default BuyToken;
