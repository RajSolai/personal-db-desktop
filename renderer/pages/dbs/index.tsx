import Head from "next/head";
import { useEffect, useState } from "react";
import axios from "axios/dist/axios";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Select from "@material-ui/core/Select/Select";
import Card from "@material-ui/core/Card/Card";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import IconButton from "@material-ui/core/IconButton/IconButton";
import TextField from "@material-ui/core/TextField/TextField";
import Button from "@material-ui/core/Button/Button";
import Fab from "@material-ui/core/Fab/Fab";
import Snackbar from "@material-ui/core/Snackbar/Snackbar";
import { useRouter } from "next/router";
import styles from "../../styles/Home.module.css";
import { ProjectDataBase } from "../../interfaces/props";
import Close from "@material-ui/icons/Close";
import AddRounded from "@material-ui/icons/AddRounded";

export default function Home() {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [snackOpen, setSnackOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [type, setType] = useState<string>("project");
  const [databases, setDataBases] = useState<ProjectDataBase[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleTypeChange = (e: any) => {
    setType(e.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getData = async () => {
    const res = await axios.get("https://fast-savannah-26464.herokuapp.com/", {
      headers: {
        "auth-token": localStorage.getItem("token"),
      },
    });
    setDataBases(res.data);
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  const AddProject = async () => {
    setOpen(false);
    const data = {
      name: name,
      type: type,
      desc: desc,
    };
    const res = await axios.post(
      `https://fast-savannah-26464.herokuapp.com/${type}`,
      data,
      {
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      }
    );
    console.log(res);
    if (res.data != "Access Denied") {
      setSnackOpen(true);
      getData();
    }
  };

  const NavigatePages = (
    dbDesc: string,
    dbType: string,
    dbName: string,
    dbId: string
  ) => {
    let currentDb = {
      dbname: dbName,
      dbdesc: dbDesc,
      dbendpoint: dbId,
    };
    localStorage.setItem("currentdb", JSON.stringify(currentDb));
    if (dbType == "project") {
      router.push("/pmgmt");
    } else if (dbType == "list") {
      router.push("/lists");
    } else {
      router.push("/");
    }
  };
  return (
    <>
      <Head>
        <title>Personal Database</title>
      </Head>
      <div className="m-2">
        <h1 className="text-3xl font-bold text-white">Select Database</h1>
        {isLoading ? (
          <div>
            <p>Loading</p>
          </div>
        ) : (
          <div className="m-1 flex flex-row flex-wrap">
            {databases.map((database, key) => (
              <div
                className="m-4 p-2 border-2 text-white rounded-lg transition duration-200 w-1/6 hover:border-purple-600 hover:text-purple-600"
                key={key}
                onClick={() =>
                  NavigatePages(
                    database.description,
                    database.type,
                    database.name,
                    database.id
                  )
                }
              >
                <h2 className="m-1 font-bold text-xl">{database.name}</h2>
                <p className="m-1 text-base">{database.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        color="primary"
        aria-label="add"
        className="flex p-3 bg-purple-600 transition rounded-md shadow-lg fab text-white hover:bg-purple-700 hover:rotate-45"
        onClick={() => setOpen(true)}
      >
        <AddRounded />
      </button>
    </>
  );
}
