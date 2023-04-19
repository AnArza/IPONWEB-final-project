import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Logout from "./Logout";
import { Link } from "react-router-dom";
import "../style/campaign.css";
import packageJSON from "../../package.json";


const EditCampaign = () => {
  const { id } = useParams();
  const [campaignName, setCampaignName] = useState("");

  useEffect(() => {
    fetch(`http://${packageJSON.DSP_IP}/api/campaigns/${id}/`)
      .then((res) => res.json())
      .then((res) => setCampaignName(res.name));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://${packageJSON.DSP_IP}/api/campaigns/${id}/`, {
      method: "PATCH",
      body: JSON.stringify({
        name: campaignName,
      }),
    }).then((res) => console.log(res.status));
    setCampaignName("");
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
        <h1>EDIT Campaign ID={id}</h1>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Campaign name"
            type="text"
            name="campaignName"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
          />
          <button type="submit" className="submit-btn">
            Save
          </button>
        </form>
      </div>
    </>
  );
};

export default EditCampaign;
