import React from "react";

import PropTypes from "prop-types";

const propTypes = {
  accounts: PropTypes.array.isRequired,
  onBuyTokens: PropTypes.func.isRequired,
};

const BuyToken = ({ accounts, onBuyTokens }) => {
  const handleBuyToken = async () => {
    await onBuyTokens(accounts[0]).send({ from: accounts[0], value: 1 });
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

BuyToken.propTypes = propTypes;

export default BuyToken;
