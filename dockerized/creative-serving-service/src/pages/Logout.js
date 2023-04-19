import { useNavigate } from "react-router-dom";
import packageJSON from "../../package.json";

const Logout = () => {
  const navigate = useNavigate();
  const logout = () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    fetch(`http://${packageJSON.DSP_IP}/logout/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ refresh: refreshToken }),
    })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          localStorage.clear();
          navigate("/");
        } else {
          throw new Error("Failed to log out");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return <button onClick={() => logout()}>Logout</button>;
};

export default Logout;
