import React, { useEffect, useState } from "react";
import { Auth } from "aws-amplify";
import './style.css'
import Home from "./home";
function Signin(props) {
  const [signInData, setSignInData] = useState({
    username: "",
    password: "",
    confirmSignin: false,
  });
  const [loginUser, setLoginUser] = useState(null);
  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const user = await Auth.currentAuthenticatedUser();
      console.log(user);
      setLoginUser(user);
      setSignInData({ confirmSignin: true });
    } catch (err) {
      console.log("authenticate user err", err);
    }
  }
  function setInput(key, value) {
    setSignInData({ ...signInData, [key]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const { username, password } = signInData;
    try {
      const user = await Auth.signIn(username, password);
      console.log("successfully signed in", user);
      setSignInData({
        username: "",
        password: "",
        confirmSignin: true,
      });
      console.log(signInData);
    } catch (error) {
      console.log("error signing in", error);
    }
  }

  return (
    <div>
      {signInData.confirmSignin === true ? (
        <Home setSignInData={setSignInData} />
      ) : (
        <div>
          <div className="container">
            <div className="signupform">
              <div className="formDiv">
                  <h2 style={{textAlign: 'center'}}>Sign In</h2>
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    value={signInData.username}
                    placeholder="User Name"
                    onChange={(event) =>
                      setInput("username", event.target.value)
                    }
                  /><br/>
                  <input
                    type="password"
                    value={signInData.password}
                    placeholder="Password"
                    onChange={(event) =>
                      setInput("password", event.target.value)
                    }
                  /><br/>
                  <button type="submit">Sign In</button>
                  <button onClick={() => props.handleSignup()}>Sign Up</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Signin;
