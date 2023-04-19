import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import Logout from "./Logout";
import "../style/campaigns.css";
import { AdOpsContext } from "../context";
import packageJSON from "../../package.json";

const Campaigns = (props) => {
  const [campaigns, setCampaigns] = useState([]);
  const [deleted, setDeleted] = useState(false);
  const [username, setUsername] = useState();
  // const [isAdOps, setIsAdOps] = useState(false);
  const { isAdOps, setIsAdOps } = useContext(AdOpsContext);

  useEffect(() => {
    setUsername(localStorage.getItem("username"));
  }, []);

  useEffect(() => {
    if (username) {
      fetch(`http://${packageJSON.DSP_IP}/users/${username}/`)
        .then((res) => res.json())
        .then((res) => setIsAdOps(res.adops));

      console.log("Campaigns: isAdOps", isAdOps);
    }
  }, [username, isAdOps, setIsAdOps]);

  useEffect(() => {
    fetch(`http://${packageJSON.DSP_IP}/api/campaigns/`)
      .then((res) => res.json())
      .then((res) => setCampaigns(res));
  }, [deleted]);

  function deleteCampaign(id) {
    fetch(`http://${packageJSON.DSP_IP}/api/campaigns/${id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          setCampaigns(campaigns.filter((c) => c.id !== id));
          setDeleted(true);
        }
        return res;
      })
      .then((res) => console.log(res));
  }

  return (
    <>
      <header>
        <button>
          <Link to={`../creatives/`}>Creatives</Link>
        </button>
        <button>
          <Link to={`../bids/`}>Bids</Link>
        </button>
        <Logout />
      </header>
      <div className="campaigns">
        <div>
          <h1>Campaigns</h1>
        </div>
        {props.gameMode === "free" && !isAdOps && (
          <button className="create-btn">
            <Link to="../campaign/create">Create</Link>
          </button>
        )}

        <table className="campaigns-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Budget</th>
              {((props.gameMode === "free" && !isAdOps) || isAdOps) && (
                <th>Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {campaigns &&
              campaigns.map((c, i) => (
                <tr key={i}>
                  <td>{c.name}</td>
                  <td>{c.budget}</td>
                  {((props.gameMode === "free" && !isAdOps) || isAdOps) && (
                    <td className="last-col">
                      <div className="action-btns">
                        <button>
                          <Link to={`../campaign/${c.id}/edit`}>Edit</Link>
                        </button>
                        {props.gameMode === "free" && !isAdOps && (
                          <button onClick={() => deleteCampaign(c.id)}>
                            Remove
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
export default Campaigns;
