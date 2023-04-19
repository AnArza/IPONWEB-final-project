import React, { useState, useEffect } from "react";
import "../style/campaign.css";
import "../style/header.css";
import Logout from "./Logout";
import { Link, useParams } from "react-router-dom";
import packageJSON from "../../package.json";

const CampaignAdOps = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    campaignName: "",
    budget: "",
    enabled: "",
    bidFloor: "",
  });

  useEffect(() => {
    fetch(`http://${packageJSON.DSP_IP}/api/campaigns/${id}/`)
      .then((res) => res.json())
      .then((res) =>
        setFormData({
          campaignName: res.name,
          budget: res.budget,
          enabled: res.enabled,
          bidFloor: res.bid_floor,
        })
      );
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://${packageJSON.DSP_IP}/api/campaigns/${id}/`, {
      method: "PATCH",
      body: JSON.stringify({
        bid_floor: parseFloat(formData.bidFloor),
        enabled: formData.enabled,
      }),
    }).then((res) => console.log(res.status));
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
          <input type="text" value={formData.campaignName} readOnly />

          <input value={formData.budget} readOnly />

          <input
            placeholder="Bid floor: 5"
            type="number"
            step="0.01"
            value={formData.bidFloor || ""}
            onChange={(e) =>
              setFormData({ ...formData, bidFloor: e.target.value })
            }
            min={0}
            max={formData.budget}
          />

          <div>
            <label htmlFor="enabled">Enabled:</label>
            <input
              id="enabled"
              type="checkbox"
              checked={formData.enabled}
              onChange={(e) =>
                setFormData({ ...formData, enabled: e.target.checked })
              }
            />
          </div>
          <button type="submit" className="submit-btn">
            Save
          </button>
        </form>
      </div>
    </>
  );
};

export default CampaignAdOps;
