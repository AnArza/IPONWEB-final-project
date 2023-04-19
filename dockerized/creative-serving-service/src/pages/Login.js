import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/login.css";
import { checkTokenExpiration } from "../checkTokenExpirarion";
import packageJSON from "../../package.json";

const Login = (props) => {
  const container = useRef(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isAdOps, setIsAdOps] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkTokenExpiration();
  }, []);

  const register = (e) => {
    e.preventDefault();
    try {
      fetch(`http://${packageJSON.DSP_IP}/register/`, {
        method: "POST",
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
          adops: isAdOps,
        }),
      }).then((res) => console.log(res));
      setUsername("");
      setPassword("");
      setEmail("");
      setIsAdOps(false);
    } catch (error) {
      console.log(error);
    }
  };

  const login = (e) => {
    e.preventDefault();
    try {
      fetch(`http://${packageJSON.DSP_IP}/login/`, {
        method: "POST",
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      })
        .then((res) => {
          if (res.status !== 404) {
            return res.json();
          } else Promise.reject("Invalid credentials");
        })
        .then((res) => {
          if (res) {
            localStorage.setItem("accessToken", res.access);
            localStorage.setItem("refreshToken", res.refresh);
            localStorage.setItem("username", username);
            return "success";
          }
        })
        .then((res) => {
          if (res) {
            navigate("/campaigns");
          }
        })
        .catch((error) => alert(error));
      setUsername("");
      setPassword("");
    } catch (error) {
      console.log(error);
      alert("Invalid login credentials");
    }
  };

  return (
    <div className="login">
      <h2>Hugs For Bugs</h2>
      <div className="container" ref={container}>
        <div className="form-container sign-up-container">
          <form method="POST">
            <h1>Create Account</h1>
            <div className="social-container">
              <a href=" " className="social">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href=" " className="social">
                <i className="fab fa-google-plus-g"></i>
              </a>
              <a href=" " className="social">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
            <span>
              This is not standart sign up, I will decide whether to allow you
              to play or not.
            </span>
            <label htmlFor="username"></label>
            <input
              type="text"
              value={username}
              id="username"
              name="username"
              placeholder="username"
              onChange={(e) => setUsername(e.target.value)}
            />
            <label htmlFor="email"></label>
            <input
              type="email"
              value={email}
              id="email"
              name="email"
              placeholder="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="password"></label>
            <input
              type="password"
              value={password}
              id="password"
              name="password"
              placeholder="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <label>
              AdOps:
              <input
                type="checkbox"
                name="adops"
                checked={isAdOps}
                onChange={(e) => {
                  setIsAdOps(e.target.checked);
                }}
              />
            </label>
            <button onClick={register}>Sign Up</button>
          </form>
        </div>
        <div className="form-container sign-in-container">
          <form method="POST">
            <h1>Sign in</h1>
            <div className="social-container">
              <a href=" " className="social">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href=" " className="social">
                <i className="fab fa-google-plus-g"></i>
              </a>
              <a href=" " className="social">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
            <span>or use your account</span>
            <label htmlFor="username"></label>
            <input
              type="text"
              value={username}
              id="username"
              name="username"
              placeholder="username"
              onChange={(e) => setUsername(e.target.value)}
            />
            <label htmlFor="password"></label>
            <input
              type="password"
              value={password}
              id="password"
              name="password"
              placeholder="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={login}>Sign In</button>
          </form>
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>
                To keep connected with us please login with your personal info
              </p>
              <button
                className="ghost"
                onClick={() =>
                  container.current.classList.remove("right-panel-active")
                }
              >
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, AZIZ!</h1>
              <p>
                This is not standart sign up, I will decide whether to allow you
                to play or not.
              </p>
              <button
                className="ghost"
                onClick={() =>
                  container.current.classList.add("right-panel-active")
                }
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
