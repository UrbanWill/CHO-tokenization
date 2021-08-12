import React, { useState } from "react";

import "./whitelist.css";

const Whitelist = ({ accounts, setKycCompleted }) => {
  const [addressToWhitelist, setAddressToWhitelist] = useState("0x123..");
  const handleInputChange = (event) => {
    setAddressToWhitelist(event.target.value);
  };

  const handleKycSubmit = async () => {
    await setKycCompleted(addressToWhitelist).send({ from: accounts[0] });
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

export default Whitelist;
