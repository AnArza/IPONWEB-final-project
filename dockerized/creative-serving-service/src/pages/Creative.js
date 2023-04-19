import React, { useState, useEffect } from "react";
import Logout from "./Logout";
import { Link } from "react-router-dom";
import "../style/creative.css";
import packageJSON from "../../package.json";


const AddCreative = () => {
  const [image, setImage] = useState(null);
  const [selectedValue, setSelectedValue] = useState();

  const [formData, setFormData] = useState({
    creativeName: "",
    externalID: "",
    categories: "",
  });

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImage(reader.result);
      };
    }
    console.log(image);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const categories = [];
    for (let c of formData.categories.split(", ")) {
      if (c !== "") {
        categories.push({ code: c });
      }
    }
    console.log(categories);
    fetch(`http://${packageJSON.DSP_IP}/api/creatives/`, {
      method: "POST",
      body: JSON.stringify({
        external_id: formData.externalID,
        name: formData.creativeName,
        categories: categories,
        campaign: { id: selectedValue },
        file: image.split(",")[1],
      }),
    })
      .then((res) => res.json())
      .then((res) => console.log(res));
    setFormData({
      creativeName: "",
      externalID: "",
      categories: "",
    });
    setImage(null);
    setSelectedValue("");
  };

  function handleOptionChange(e) {
    setSelectedValue(e.target.value);
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
        <h1>Creative</h1>
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
            placeholder="test_11"
            type="text"
            name="externalID"
            value={formData.externalID}
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
          <select onChange={handleOptionChange} value={selectedValue}>
            <option value="">---Select---</option>
            {campaigns &&
              campaigns.map((c, i) => (
                <option value={c.id} key={i}>
                  {c.name}
                </option>
              ))}
          </select>
          {image && <img src={image} alt="" />}
          <input type="file" onChange={handleImageChange} accept="image/*" />
          <button type="submit" className="submit-btn">
            Save
          </button>
        </form>
      </div>
    </>
  );
};

export default AddCreative;
