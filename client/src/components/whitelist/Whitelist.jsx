import React, { useState } from "react";

import PropTypes from "prop-types";

import "./whitelist.css";

const propTypes = {
  accounts: PropTypes.array.isRequired,
  onSetKycCompleted: PropTypes.func.isRequired,
};

const Whitelist = ({ accounts, onSetKycCompleted }) => {
  const [addressToWhitelist, setAddressToWhitelist] = useState("0x123..");

  const handleInputChange = (event) => {
    setAddressToWhitelist(event.target.value);
  };

  const handleKycSubmit = async () => {
    await onSetKycCompleted(addressToWhitelist).send({ from: accounts[0] });
    alert(`Account ${addressToWhitelist} is now whitelisted`);
  };

  return (
    <div className="whitelist-container">
      <h2>Enable your account</h2>
      <div className="whitelist-input-container">
        <p>Address to allow:</p>
        <input
          type="text"
          name="kycAddress"
          value={addressToWhitelist}
          onChange={handleInputChange}
        />
      </div>
      <button type="button" onClick={handleKycSubmit}>
        Add Address to Whitelist
      </button>
    </div>
  );
};

Whitelist.propTypes = propTypes;

export default Whitelist;
