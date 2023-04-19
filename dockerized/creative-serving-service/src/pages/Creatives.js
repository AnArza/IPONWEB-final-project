import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import Logout from "./Logout";
import "../style/creatives.css";
import { AdOpsContext } from "../context";
import packageJSON from "../../package.json";



const Creatives = (props) => {
  const [creatives, setCreatives] = useState([]);
  const { isAdOps } = useContext(AdOpsContext);


  useEffect(() => {
    fetch(`http://${packageJSON.DSP_IP}/api/creatives/`)
      .then((res) => res.json())
      .then((res) => setCreatives(res));
  }, []);

  function deleteCreative(id) {
    fetch(`http://${packageJSON.DSP_IP}/api/creatives/${id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          setCreatives(creatives.filter((c) => c.id !== id));
        }
        return res.json();
      })
      .then((res) => console.log(res));
  }

  return (
    <>
      <header>
        <button>
          <Link to={`../campaigns/`}>Campaigns</Link>
        </button>
        <button>
          <Link to={`../bids/`}>Bids</Link>
        </button>
        <Logout />
      </header>
      <div className="campaigns">
        <div>
          <h1>Creatives</h1>
        </div>
        {props.gameMode === "free" && !isAdOps && (
          <button className="create-btn">
            <Link to="../creative/create">Create</Link>
          </button>
        )}

        <table className="creatives-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>External ID</th>
              {props.gameMode === "free" && !isAdOps && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {creatives &&
              creatives.map((c, i) => (
                <tr key={i}>
                  <td>{c.name}</td>
                  <td>{c.external_id}</td>
                  {props.gameMode === "free" && !isAdOps && (
                    <td className="last-col">
                      <div className="action-btns">
                        <button>
                          <Link to={`../creative/${c.id}/edit`}>Edit</Link>
                        </button>
                        <button onClick={() => deleteCreative(c.id)}>
                          Remove
                        </button>
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
export default Creatives;
