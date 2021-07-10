import LockOpen from "@material-ui/icons/LockOpen";
import axios from "axios/dist/axios";
import router from "next/router";
import { useState } from "react";

const App = () => {
  const [passcode, setPass] = useState<string>("");
  const login = async () => {
    let cred = {
      passcode: passcode,
    };
    await axios
      .post("https://fast-savannah-26464.herokuapp.com/login", cred)
      .then((res) => {
        console.log(res.data.token);
        localStorage.setItem("token", res.data.token);
        router.push("/dbs");
      })
      .catch((e) => console.error(e));
  };
  return (
    <>
      <section className="flex flex-column justify-center items-center content-center full">
        <div className="flex flex-row justify-center items-center content-center">
          <input
            className="flex p-3 border-transparent rounded-md shadow-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600 bg-gray-800"
            type="text"
            value={passcode}
            placeholder="Enter Pass Code"
            onChange={(e) => setPass(e.target.value)}
            id="usrtoken"
          />
          &nbsp;&nbsp;&nbsp;
          <button className="p-3 m-1 shadow-md rounded-xl bg-purple-600 transition duration-200 focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 hover:bg-purple-700"  onClick={() => login()}>
            <LockOpen />
          </button>
        </div>
      </section>
    </>
  );
};

export default App;
