import { useState, useEffect } from "react";
import facade from "../../facade/apiFacade";
function LogIn() {
  const init = { username: "", password: "" };

  // State hooks for login cred, loginstatus and server data
  const [loginCredentials, setLoginCredentials] = useState(init);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dataFromServer, setDataFromServer] = useState("Loading...");

  // useEffect hook to fetch data from server when loginstatus changes
  useEffect(() => {
    facade.fetchData("hotels", "GET").then((data) => setDataFromServer(data));
  }, [isLoggedIn]);

  // Method to do login and update loginstatus
  const performLogin = (evt) => {
    evt.preventDefault();
    facade.login(
      loginCredentials.username,
      loginCredentials.password,
      setIsLoggedIn
    );
  };

  // Method to update logininfo if input fields change
  const onChange = (evt) => {
    setLoginCredentials({
      // ...loginCredentials contains existing values of username and password
      ...loginCredentials,
      // Update value of input fields by using id as key
      [evt.target.id]: evt.target.value,
    });
  };

  // JSX
  return (
    <>
      <div id="login-form-api">
        <h3>Log ind</h3>
        <form onChange={onChange}>
          <input placeholder="Brugernavn" id="username" />
          <input placeholder="Kodeord" id="password" />
          <button onClick={performLogin}>Log ind</button>
        </form>
        <div>
          {isLoggedIn ? (
            <div>
              <p>Du er logget ind, {facade.getUserRoles()}</p>
              <button onClick={() => facade.logout(setIsLoggedIn)}>
                Logout
              </button>
              <p>Deling af denne info er strafbart!</p>
              {dataFromServer.map((hotel) => (
                <p key={hotel.id}> {hotel.hotelName}</p>
              ))}
              {JSON.stringify(dataFromServer)}
            </div>
          ) : (
            <p>Log ind for at se hotel info</p>
          )}
        </div>
      </div>
    </>
  );
}

export default LogIn;
