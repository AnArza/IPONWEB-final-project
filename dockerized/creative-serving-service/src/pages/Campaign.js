import React, { useState, useEffect } from "react";
import "../style/campaign.css";
import "../style/header.css";
import Logout from "./Logout";
import { Link } from "react-router-dom";
import packageJSON from "../../package.json";

const AddCampaign = () => {
  const [formData, setFormData] = useState({
    campaignName: "",
    budget: "",
  });

  const [totalBudget, setTotalBudget] = useState(0);
  useEffect(() => {
    fetch(`http://${packageJSON.DSP_IP}/game/configure/`)
      .then((res) => res.json())
      .then((res) => setTotalBudget(res.budget));
  }, []);

  const [maxBudget, setMaxBudget] = useState(0);

  const [campaigns, setCampaigns] = useState([]);
  useEffect(() => {
    fetch(`http://${packageJSON.DSP_IP}/api/campaigns/`)
      .then((res) => res.json())
      .then((res) => setCampaigns(res));
  }, [formData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://${packageJSON.DSP_IP}/api/campaigns/`, {
      method: "POST",
      body: JSON.stringify({
        name: formData.campaignName,
        budget: parseFloat(formData.budget),
      }),
    })
      .then((res) => res.json())
      .then((res) => console.log(res));
    setFormData({
      campaignName: "",
      budget: "",
    });
  };

  const handleChange = (event) => {
    let usedBudget = 0;
    campaigns.map((c) => (usedBudget += parseFloat(c.reserved_budget)));
    setMaxBudget((totalBudget - usedBudget).toFixed(2));
    console.log(maxBudget);
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <>
      <header>
        <button>
          <Link to={`../campaigns/`}>Campaigns</Link>
        </button>
        <button>
          <Link to={`../creatives/`}>Creatives</Link>
        </button>
        <button>
          <Link to={`../bids/`}>Bids</Link>
        </button>
        <Logout />
      </header>
      <div className="campaign">
        <h1>Campaign</h1>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Campaign name"
            type="text"
            name="campaignName"
            value={formData.campaignName}
            onChange={handleChange}
          />
          <input
            placeholder="Budget: 50"
            type="number"
            step="0.01"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            min={0}
            max={maxBudget}
          />
          {/* <input placeholder='Bid floor: 5' type="number"/> */}
          <button type="submit" className="submit-btn">
            Save
          </button>
        </form>
      </div>
    </>
  );
};

export default AddCampaign;
