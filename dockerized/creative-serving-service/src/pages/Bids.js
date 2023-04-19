import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import Logout from "./Logout";
import "../style/bids.css";
import { AdOpsContext } from "../context";
import packageJSON from "../../package.json";

const Bids = (props) => {
  const [bids, setBids] = useState([]);
  const [coeff, setCoeff] = useState("");
  let impCount = 0;
  let clickCount = 0;
  let convCount = 0;
  const { isAdOps } = useContext(AdOpsContext);

  useEffect(() => {
    fetch(`http://${packageJSON.DSP_IP}/rtb/bid/`)
      .then((res) => res.json())
      .then((res) => setBids(res));
  }, []);

  bids.forEach((b) => {
    if (b.win) {
      ++impCount;
    }
    if (b.click_happened) {
      ++clickCount;
    }
    if (b.conversion_happened) {
      ++convCount;
    }
  });

  bids.sort((a, b) => a.id - b.id);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (parseInt(coeff)) {
      fetch(`http://${packageJSON.DSP_IP}/game/configure/edit/`, {
        method: "PATCH",
        body: JSON.stringify({
          coefficient: parseInt(coeff),
        }),
      }).then((res) => console.log(res + " edited"));
      console.log("yaaay finished");
    } else {
      alert("Input number");
    }
    setCoeff("");
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
        <Logout />
      </header>
      <div className="bids">
        <div>
          <h1>Bids</h1>
          {isAdOps && (
            <div>
              <input
                type="number"
                value={coeff}
                onChange={(e) => setCoeff(e.target.value)}
              />
              <button type="submit" onClick={handleSubmit}>
                Change Coefficient
              </button>
            </div>
          )}
          <br />
          <table className="bids-table">
            <thead>
              <tr>
                <th>Impression</th>
                <th>Click</th>
                <th>Conversion</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{impCount}</td>
                <td>{clickCount}</td>
                <td>{convCount}</td>
              </tr>
            </tbody>
          </table>
          <br />
        </div>

        <table className="bids-table">
          <thead>
            <tr>
              <th>Current Round</th>
              <th>ID</th>
              <th>External ID</th>
              <th>Click Probability</th>
              <th>Conversion Probability</th>
              <th>Site Domain</th>
              <th>Auth SSP</th>
              <th>User ID</th>
              <th>Price</th>
              <th>Creative</th>
              <th>Win</th>
              <th>Click Happened</th>
              <th>Conversion Happened</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            {bids &&
              bids.map((b, i) => (
                <tr key={i}>
                  <td>{b.current_round}</td>
                  <td>{b.id}</td>
                  <td>{b.external_id}</td>
                  <td>{b.click_prob}</td>
                  <td>{b.conv_prob}</td>
                  <td>{b.site_domain}</td>
                  {b.auth_ssp && <td>✅</td>}
                  {!b.auth_ssp && <td>❌</td>}
                  <td>{b.user_id}</td>
                  <td>{b.price}</td>
                  <td>{b.creative_id}</td>
                  {b.win && <td>✅</td>}
                  {!b.win && <td>❌</td>}
                  {b.click_happened && <td>✅</td>}
                  {!b.click_happened && <td>❌</td>}
                  {b.conversion_happened && <td>✅</td>}
                  {!b.conversion_happened && <td>❌</td>}
                  <td>{b.revenue}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
export default Bids;