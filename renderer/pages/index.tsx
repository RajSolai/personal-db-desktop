import { TextField } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Close from "@material-ui/icons/Close";
import axios from "axios/dist/axios";
import router from "next/router";
import styles from "../styles/Home.module.css";
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
      <section className={styles.loginSection}>
        <div className={styles.loginDivision}>
          <TextField
            label="Enter Code to Login"
            value={passcode}
            onChange={(e) => setPass(e.target.value)}
            id="usrtoken"
          />
          &nbsp;&nbsp;&nbsp;
          <IconButton
            size="medium"
            aria-label="close"
            color="inherit"
            onClick={() => login()}
          >
            <Close />
          </IconButton>
        </div>
      </section>
    </>
  );
};

export default App;
