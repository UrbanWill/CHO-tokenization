import React, { useState } from "react";

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
    <div>
      Address to allow:{" "}
      <input
        type="text"
        name="kycAddress"
        value={addressToWhitelist}
        onChange={handleInputChange}
      />
      <button type="button" onClick={handleKycSubmit}>
        Add Address to Whitelist
      </button>
    </div>
  );
};

export default Whitelist;
