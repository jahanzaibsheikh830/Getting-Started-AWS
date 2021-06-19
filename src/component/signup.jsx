import React, { useState } from "react";
import { Auth } from "aws-amplify";
import "./style.css";
function Signup(props) {
  const [signupData, setSignupData] = useState({
    username: "",
    password: "",
    email: "",
    phone_number: "",
    confirmationCode: "",
    verified: false,
  });

  function setInput(key, value) {
    setSignupData({ ...signupData, [key]: value });
  }

  async function signup() {
    const { username, password, email, phone_number } = signupData;
    console.log(signupData);
    try {
      const { user } = await Auth.signUp({
        username: username,
        password: password,
        attributes: {
          phone_number: phone_number,
          email: email,
        },
      });
      console.log(user.username);
      setSignupData({
        password: "",
        email: "",
        username: user.username,
        verified: true,
        phone_number: "",
      });
    } catch (err) {
      console.log(err);
    }
  }

  function confirmSignUp() {
    const { username, confirmationCode } = signupData;
    console.log(signupData);
    Auth.confirmSignUp(username, confirmationCode)
      .then(() => {
        console.log("Successfully confirmed signed up");
        props.handleSignup();
        setSignupData({
          confirmationCode: "",
          username: "",
        });
      })
      .catch((err) =>
        console.log(`Error confirming sign up - ${JSON.stringify(err)}`)
      );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (signupData.verified) {
      confirmSignUp();
    } else {
      signup();
    }
  }

  return (
    <div>
      {signupData.verified? (
          <div className="container">
            <div className="signupform">
              <div className="formDiv">
              <form onSubmit={handleSubmit}>
                <input
                  id="confirmationCode"
                  placeholder='Confirmation Code'
                  type="text"
                  onChange={(event) =>
                    setInput("confirmationCode", event.target.value)
                  }
                />
                <button>Confirm Sign up</button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className="container">
          <div className="signupform">
            <div className="formDiv">
              <h2 style={{ textAlign: "center" }}>Signup</h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  value={signupData.username}
                  placeholder="User Name"
                  onChange={(event) => setInput("username", event.target.value)}
                />
                <br />
                <input
                  type="password"
                  value={signupData.password}
                  placeholder="Password"
                  onChange={(event) => setInput("password", event.target.value)}
                />
                <br />
                <input
                  type="email"
                  value={signupData.email}
                  placeholder="Email"
                  onChange={(event) => setInput("email", event.target.value)}
                />
                <br />
                <input
                  type="phone"
                  value={signupData.phone_number}
                  placeholder="Phone Number"
                  onChange={(event) =>
                    setInput("phone_number", event.target.value)
                  }
                />
                <br />
                <button type="submit">Sign up</button>
                <button onClick={() => props.handleSignup()}>Sign In</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Signup;
