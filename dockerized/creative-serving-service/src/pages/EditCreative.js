import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../style/creative.css";
import Logout from "./Logout";
import { Link } from "react-router-dom";
import packageJSON from "../../package.json";

const EditCreative = () => {
  const { id } = useParams();

  const [formData, setFormData] = useState({
    creativeName: "",
    categories: "",
    image: null,
    selectedValue: "",
  });

  useEffect(() => {
    fetch(`http://${packageJSON.DSP_IP}/api/creatives/${id}/`)
      .then((res) => res.json())
      .then((res) =>
        setFormData({
          creativeName: res.name,
          categories: res.categories.join(", "),
          image: res.url,
          selectedValue: res.campaign.id,
        })
      );
  }, [id]);

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const categories = [];
    for (let c of formData.categories.split(", ")) {
      if (c !== "") {
        categories.push({ code: c });
      }
    }
    fetch(`http://${packageJSON.DSP_IP}/api/creatives/${id}/`, {
      method: "PATCH",
      body: JSON.stringify({
        name: formData.creativeName,
        categories: categories,
        campaign: { id: formData.selectedValue },
        file: formData.image.split(",")[1],
      }),
    }).then((res) => console.log(res + " edited"));
    console.log("yaaay finished");
  };

  function handleOptionChange(e) {
    setFormData({ ...formData, selectedValue: e.target.value });
  }

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const [campaigns, setCampaigns] = useState([]);
  useEffect(() => {
    fetch(`http://${packageJSON.DSP_IP}/api/campaigns/`)
      .then((res) => res.json())
      .then((res) => setCampaigns(res));
  }, []);

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
      <div className="creative">
        <h1>EDIT Creative ID={id}</h1>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Creative 11"
            type="text"
            name="creativeName"
            value={formData.creativeName}
            onChange={handleChange}
            required
          />
          <input
            placeholder="IAB1, IAB2, IAB3 (categories)"
            type="text"
            name="categories"
            value={formData.categories}
            onChange={handleChange}
          />
          <select onChange={handleOptionChange} value={formData.selectedValue}>
            <option value="">---Select---</option>
            {campaigns &&
              campaigns.map((c, i) => (
                <option value={c.id} key={i}>
                  {c.name}
                </option>
              ))}
          </select>
          {formData.image && <img src={formData.image} alt="" />}
          <input type="file" onChange={handleImageChange} accept="image/*" />
          <button type="submit" className="submit-btn">
            Save
          </button>
        </form>
      </div>
    </>
  );
};

export default EditCreative;
