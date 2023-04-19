import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Creatives from "./pages/Creatives";
import AddCreative from "./pages/Creative";
import Campaigns from "./pages/Campaigns";
import AddCampaign from "./pages/Campaign";
import EditCampaign from "./pages/EditCampaign";
import EditCreative from "./pages/EditCreative";
import CampaignAdOps from "./pages/CampaignAdOps";
import Bids from "./pages/Bids";
import Login from "./pages/Login";
import PrivateRoute from "./PrivateRoute";
import { AdOpsContext } from "./context";
import packageJSON from "../package.json";

function App() {
  const [gameMode, setGameMode] = useState();
  const { isAdOps } = useContext(AdOpsContext);

  useEffect(() => {
    fetch(`http://${packageJSON.DSP_IP}/game/configure/`)
      .then((res) => res.json())
      .then((res) => setGameMode(res.mode));
    console.log("GAME MODE");
    console.log(gameMode);
    console.log("IS ADOPS");
    console.log(isAdOps);
  }, [gameMode, isAdOps]);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<PrivateRoute />}>
            <Route
              path="/creatives"
              element={<Creatives gameMode={gameMode} />}
            />
            {((gameMode === "free" && !isAdOps) || isAdOps) && (
              <Route path="/creative/create" element={<AddCreative />} />
            )}
            <Route
              path="/campaigns"
              element={<Campaigns gameMode={gameMode} />}
            />
            {((gameMode === "free" && !isAdOps) || isAdOps) && (
              <Route path="/campaign/create" element={<AddCampaign />} />
            )}
            {gameMode === "free" && !isAdOps && (
              <Route path="/campaign/:id/edit" element={<EditCampaign />} />
            )}
            {isAdOps && (
              <Route path="/campaign/:id/edit" element={<CampaignAdOps />} />
            )}
            {((gameMode === "free" && !isAdOps) || isAdOps) && (
              <Route path="/creative/:id/edit" element={<EditCreative />} />
            )}
            <Route path="/bids" element={<Bids/>}/>
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
