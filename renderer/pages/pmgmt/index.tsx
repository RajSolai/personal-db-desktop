import { useEffect, useState } from "react";
import axios from "axios";
import {
  Paper,
  TextField,
  Button,
  Typography,
  Breadcrumbs,
  Link,
  Fab,
  Snackbar,
  IconButton,
} from "@material-ui/core";
import TaskCard from "../../components/taskcard";
import styles from "../../styles/Home.module.css";
import { Save, Close } from "@material-ui/icons";
import { ProjectDataBase } from "../../interfaces/props";

const Pmgmt: React.FC<any> = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [dbName, setDbName] = useState<string>("");
  const [notStarted, setNotStarted] = useState<string[]>([]);
  const [progress, setProgress] = useState<string[]>([]);
  const [completed, setCompleted] = useState<string[]>([]);
  const [taskText, setTaskText] = useState<string>("");
  const [dbEndPt, setDbEndPt] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let currentDbString = localStorage.getItem("currentdb");
    let dbDetails = JSON.parse(currentDbString == null ? "" : currentDbString);
    const { dbname, dbdesc, dbendpoint } = dbDetails;

    console.log("got db details");
    axios
      .get<ProjectDataBase>(
        `https://fast-savannah-26464.herokuapp.com/project/${dbendpoint}`
      )
      .then((res) => {
        console.dir(res.data);
        setDbEndPt(dbendpoint);
        setDbName(dbname);
        setNotStarted(res.data.body.notStarted);
        setProgress(res.data.body.progress);
        setCompleted(res.data.body.completed);
      });
    console.log("data fetch complete");
    setLoading(false);
  }, []);

  const onCardDrop = (e: any) => {
    e.preventDefault();
    let data = e.dataTransfer.getData("text");
    let parentData = e.dataTransfer.getData("parent");
    // if the parent and target are same
    if (e.target.id == parentData) {
      return;
    }
    // add sequence
    if (e.target.id == "complete") {
      addToCompleted(data);
    }
    if (e.target.id == "nstart") {
      addToNotStarted(data);
    }
    if (e.target.id == "prog") {
      addToProgress(data);
    }
    // delete sequence
    if (parentData == "nstart") {
      removeFromNotStarted(data);
    }
    if (parentData == "prog") {
      removeFromProgress(data);
    }
    if (parentData == "complete") {
      removeFromCompleted(data);
    }
  };
  const allowDrop = (e: any) => {
    e.preventDefault();
  };
  const onCardDrag = (e: any) => {
    e.dataTransfer.setData("text", e.target.id);
    e.dataTransfer.setData("parent", e.target.parentNode.id);
  };
  const addToCompleted = (task: string) => {
    let temp = completed;
    temp = [...completed, task];
    setCompleted(temp);
  };
  const addToProgress = (task: string) => {
    let temp = progress;
    temp = [...progress, task];
    setProgress(temp);
  };
  const addToNotStarted = (task: string) => {
    let temp = notStarted;
    temp = [...notStarted, task];
    setNotStarted(temp);
  };
  const removeFromNotStarted = (task: string) => {
    let temp = notStarted.filter((e) => e != task);
    console.log(temp);
    setNotStarted(temp);
  };
  const removeFromProgress = (task: string) => {
    let temp = progress.filter((e) => e != task);
    console.log(temp);
    setProgress(temp);
  };
  const removeFromCompleted = (task: string) => {
    let temp = completed.filter((e) => e != task);
    console.log(temp);
    setCompleted(temp);
  };
  const saveData = async () => {
    const data = {
      completed: completed,
      progress: progress,
      notStarted: notStarted,
    };
    console.dir(data);
    const result = await axios.put(
      `https://fast-savannah-26464.herokuapp.com/project/${dbEndPt}`,
      data
    );
    if (result.status == 200) {
      setOpen(true);
    }
  };
  const removeTask = (id: string) => {
    let element: any = document.getElementById(id);
    if (element.parentNode.id == "nstart") {
      removeFromNotStarted(id);
    }
    if (element.parentNode.id == "prog") {
      removeFromProgress(id);
    }
    if (element.parentNode.id == "complete") {
      removeFromCompleted(id);
    }
  };
  const HandleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div className={styles.wrapper}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" href="/">
            Home
          </Link>
          <Typography color="textPrimary">{dbName}</Typography>
        </Breadcrumbs>
        <h1>Project {dbName}</h1>
        <div className={styles.inputWrapper}>
          <TextField
            id="standard-basic"
            value={taskText}
            label="Add Task"
            onChange={(e) => setTaskText(e.target.value)}
          />
          &nbsp; &nbsp; &nbsp;
          <Button
            variant="contained"
            color="primary"
            onClick={() => addToNotStarted(taskText)}
          >
            Add Task
          </Button>
        </div>
        <div className={styles.parent}>
          <Paper
            id="nstart"
            className={styles.holder}
            onDrop={onCardDrop}
            onDragOver={allowDrop}
          >
            <h2>Not Started</h2>
            {isLoading ? (
              <p>loading</p>
            ) : (
              notStarted.map((data, key) => (
                <TaskCard
                  key={key}
                  id={data}
                  onDrag={onCardDrag}
                  onDelete={() => removeTask(data)}
                  taskName={data}
                />
              ))
            )}
          </Paper>
          <Paper
            id="prog"
            className={styles.holder}
            onDrop={onCardDrop}
            onDragOver={allowDrop}
          >
            <h2>In Progress</h2>

            {isLoading ? (
              <p>loading</p>
            ) : (
              progress.map((data, key) => (
                <TaskCard
                  id={data}
                  key={key}
                  onDrag={onCardDrag}
                  onDelete={() => removeTask(data)}
                  taskName={data}
                />
              ))
            )}
          </Paper>
          <Paper
            id="complete"
            className={styles.holder}
            onDrop={onCardDrop}
            onDragOver={allowDrop}
          >
            <h2>Completed</h2>

            {isLoading ? (
              <p>loading</p>
            ) : (
              completed.map((data, key) => (
                <TaskCard
                  key={key}
                  id={data}
                  onDrag={onCardDrag}
                  onDelete={() => removeTask(data)}
                  taskName={data}
                />
              ))
            )}
          </Paper>
        </div>
        <Snackbar
          open={open}
          autoHideDuration={3000}
          onClose={HandleClose}
          message="Changes Saved Successfully 🎉️"
          action={
            <>
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={HandleClose}
              >
                <Close />
              </IconButton>
            </>
          }
        />
        <Fab
          color="primary"
          aria-label="add"
          className={styles.fab}
          onClick={saveData}
        >
          <Save />
        </Fab>
      </div>
    </>
  );
};

export default Pmgmt;
