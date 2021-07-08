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
      {
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      },
      data
    );
    if (res.status == 200) {
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
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Select Database</h1>
        {isLoading ? (
          <div>
            <p>Loading</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {databases.map((database, key) => (
              <Card
                className={styles.projectCard}
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
                <h2>{database.name}</h2>
                <p>{database.description}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={() => setSnackOpen(false)}
        message="Created New Database Successfully 🎉️"
        action={
          <>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => setSnackOpen(false)}
            >
              <Close />
            </IconButton>
          </>
        }
      />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Create New Database</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter details to add new Database.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            onChange={(e) => setName(e.target.value)}
            label="Name"
            type="text"
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            id="desc"
            onChange={(e) => setDesc(e.target.value)}
            label="Description"
            type="text"
            fullWidth
          />
          <Select
            native
            value={type}
            onChange={handleTypeChange}
            inputProps={{
              name: "type",
              id: "select-type",
            }}
          >
            <option value={"project"}>Project</option>
            <option value={"list"}>Lists</option>
            <option value={"table"} disabled>
              Table (comming soon)
            </option>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={AddProject} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
      <Fab
        color="primary"
        aria-label="add"
        className={styles.fab}
        onClick={() => setOpen(true)}
      >
        <AddRounded />
      </Fab>
    </>
  );
}
