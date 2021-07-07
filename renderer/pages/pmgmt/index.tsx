import { useEffect, useState } from "react";
import Head from "next/head";
import axios from "axios/dist/axios";
import Paper from "@material-ui/core/Paper/Paper";
import IconButton from "@material-ui/core/IconButton/IconButton";
import TextField from "@material-ui/core/TextField/TextField";
import Button from "@material-ui/core/Button/Button";
import Fab from "@material-ui/core/Fab/Fab";
import Snackbar from "@material-ui/core/Snackbar/Snackbar";
import Breadcrumbs from "@material-ui/core/Breadcrumbs/Breadcrumbs";
import Link from "@material-ui/core/Link/Link";
import Typography from "@material-ui/core/Typography/Typography";
import TaskCard from "../../components/taskcard";
import styles from "../../styles/Home.module.css";
import Save from "@material-ui/icons/Save";
import Close from "@material-ui/icons/Close";
import { ProjectDataBase, ProjectTask } from "../../interfaces/props";
import { nanoid } from "nanoid";

const Pmgmt: React.FC<any> = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [dbName, setDbName] = useState<string>("");
  const [notStarted, setNotStarted] = useState<ProjectTask[]>([]);
  const [progress, setProgress] = useState<ProjectTask[]>([]);
  const [completed, setCompleted] = useState<ProjectTask[]>([]);
  const [taskText, setTaskText] = useState<string>("");
  const [dbDesc, setDesc] = useState<string>("");
  const [dbEndPt, setDbEndPt] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let currentDbString = localStorage.getItem("currentdb");
    let dbDetails = JSON.parse(currentDbString == null ? "" : currentDbString);
    const { dbname, dbdesc, dbendpoint } = dbDetails;
    setDesc(dbdesc);
    setDbEndPt(dbendpoint);
    setDbName(dbname);
    axios
      .get<ProjectDataBase>(
        `https://fast-savannah-26464.herokuapp.com/database/${dbendpoint}`,
        {
          headers: {
            "auth-token": localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        console.dir(res.data);
        setNotStarted(res.data.body.notStarted);
        setProgress(res.data.body.progress);
        setCompleted(res.data.body.completed);
      });
    setLoading(false);
  }, []);

  const onCardDrop = (e: any) => {
    e.preventDefault();
    let data = e.dataTransfer.getData("text");
    let id = e.dataTransfer.getData("id");
    let theTask: ProjectTask = {
      id: id,
      task: data,
    };
    let parentData = e.dataTransfer.getData("parent");
    console.log(parentData);
    // if the parent and target are same
    if (e.target.id == parentData) {
      return;
    }
    // add sequence
    if (e.target.id == "complete") {
      addToCompleted(theTask);
    }
    if (e.target.id == "nstart") {
      addToNotStarted(theTask);
    }
    if (e.target.id == "prog") {
      addToProgress(theTask);
    }
    // delete sequence
    if (parentData == "nstart") {
      removeFromNotStarted(id);
    }
    if (parentData == "prog") {
      removeFromProgress(id);
    }
    if (parentData == "complete") {
      removeFromCompleted(id);
    }
  };
  const allowDrop = (e: any) => {
    e.preventDefault();
  };
  const onCardDrag = (e: any) => {
    let [taskId,taskName] = e.target.id.toString().split(":");
    e.dataTransfer.setData("id", taskId);
    e.dataTransfer.setData("text", taskName);
    e.dataTransfer.setData("parent", e.target.parentNode.id);
    console.log(taskName);
  };
  const addToCompleted = (task: ProjectTask) => {
    let temp = completed;
    temp = [...completed, task];
    setCompleted(temp);
  };
  const addToProgress = (task: ProjectTask) => {
    let temp = progress;
    temp = [...progress, task];
    setProgress(temp);
  };
  const addToNotStarted = (task: ProjectTask) => {
    let temp = notStarted;
    temp = [...notStarted, task];
    setNotStarted(temp);
  };
  const removeFromNotStarted = (taskId:String) => {
    let temp = notStarted.filter((e) => e.id != taskId);
    setNotStarted(temp);
  };
  const removeFromProgress = (taskId:String) => {
    let temp = progress.filter((e) => e.id != taskId);
    setProgress(temp);
  };
  const removeFromCompleted = (taskId:String) => {
    let temp = completed.filter((e) => e.id != taskId);
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
      data,
      {
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      }
    );
    if (result.status == 200) {
      setOpen(true);
    }
  };
  const removeTask = (task: ProjectTask) => {
    let element: any = document.getElementById(`${task.id}:${task.task}`);
    if (element.parentNode.id == "nstart") {
      removeFromNotStarted(task.id);
    }
    if (element.parentNode.id == "prog") {
      removeFromProgress(task.id);
    }
    if (element.parentNode.id == "complete") {
      removeFromCompleted(task.id);
    }
  };
  const HandleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Head>
        <title>{dbName}</title>
      </Head>
      <div className={styles.wrapper}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" href="dbs">
            Home
          </Link>
          <Typography color="textPrimary">{dbName}</Typography>
        </Breadcrumbs>
        <h1>Project {dbName}</h1>
        <span>{dbDesc}</span>
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
            onClick={() => {
              let newTask: ProjectTask = {
                id: nanoid(8),
                task: taskText,
              };
              addToNotStarted(newTask);
              setTaskText("");
            }}
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
            <h2 className={styles.nstart}>Not Started</h2>
            {isLoading ? (
              <p>loading</p>
            ) : (
              notStarted.map((data, key) => (
                <TaskCard
                  key={key}
                  id={`${data.id}:${data.task}`}
                  onDrag={onCardDrag}
                  onDelete={() => removeTask(data)}
                  taskName={data.task}
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
            <h2 className={styles.progress}>In Progress</h2>

            {isLoading ? (
              <p>loading</p>
            ) : (
              progress.map((data, key) => (
                <TaskCard
                  key={key}
                  id={`${data.id}:${data.task}`}
                  onDrag={onCardDrag}
                  onDelete={() => removeTask(data)}
                  taskName={data.task}
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
            <h2 className={styles.completed}>Completed</h2>

            {isLoading ? (
              <p>loading</p>
            ) : (
              completed.map((data, key) => (
                <TaskCard
                  key={key}
                  id={`${data.id}:${data.task}`}
                  onDrag={onCardDrag}
                  onDelete={() => removeTask(data)}
                  taskName={data.task}
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
