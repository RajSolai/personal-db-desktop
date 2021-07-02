import Head from "next/head";
import Breadcrumbs from "@material-ui/core/Breadcrumbs/Breadcrumbs";
import Typography from "@material-ui/core/Typography/Typography";
import Link from "@material-ui/core/Link/Link";
import axios from "axios/dist/axios";
import { nanoid } from "nanoid";
import { Paper } from "@material-ui/core";
import TextField from "@material-ui/core/TextField/TextField";
import Button from "@material-ui/core/Button/Button";
import Checkbox from "@material-ui/core/Checkbox";
import { ListDataType, ListItemType } from "../../interfaces/props";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import Save from "@material-ui/icons/Save";
import IconButton from "@material-ui/core/IconButton/IconButton";
import Close from "@material-ui/icons/Close";
import Snackbar from "@material-ui/core/Snackbar/Snackbar";
import Fab from "@material-ui/core/Fab/Fab";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import styles from "../../styles/Home.module.css";
import { useState, useEffect } from "react";

const Lists: React.FC<any> = () => {
  const [dbName, setDbName] = useState<string>("");
  const [dbEndPt, setEndPt] = useState<string>("");
  const [dbDesc, setDbDesc] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [taskText, setTaskTxt] = useState<string>("");
  const [list, setList] = useState<ListItemType[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [completedList, setCompleted] = useState<ListItemType[]>([]);

  useEffect(() => {
    let currentDbString = localStorage.getItem("currentdb");
    let dbDetails = JSON.parse(currentDbString == null ? "" : currentDbString);
    const { dbname, dbdesc, dbendpoint } = dbDetails;
    setDbName(dbname);
    setDbDesc(dbdesc);
    setEndPt(dbendpoint);
    axios
      .get<ListDataType>(
        `https://fast-savannah-26464.herokuapp.com/database/${dbendpoint}`
      )
      .then((res) => {
        console.dir(res.data);
        setList(res.data.body.todoList);
        setCompleted(res.data.body.completedList);
      });
    setLoading(false);
  }, []);

  const saveData = async () => {
    const data = {
      todoList: list,
      completedList: completedList,
    };
    console.dir(data);
    const result = await axios.put(
      `https://fast-savannah-26464.herokuapp.com/list/${dbEndPt}`,
      data
    );
    if (result.status == 200) {
      setOpen(true);
    }
  };

  const handleCompleteChange = (e: any) => {
    if (!e.target.checked) {
      // re add to list from checked list
      let thetask = completedList.find((item) => item.id == e.target.value);
      const remaining = completedList.filter(
        (item) => item.id != e.target.value
      );
      setCompleted(remaining);
      thetask!.checked = false;
      setList([thetask!, ...list]);
    } else {
      // add to checked list
      let thetask = list.find((item) => item.id == e.target.value);
      const remaining = list.filter((item) => item.id != e.target.value);
      setList(remaining);
      thetask!.checked = true;
      setCompleted([thetask!, ...completedList]);
    }
  };

  const addTask = async (task: string) => {
    const temp: ListItemType = {
      id: nanoid(8),
      task: task,
      checked: false,
    };
    setList([temp, ...list]);
    setTaskTxt("");
  };

  return (
    <>
      <Head>
        <title>{dbName}</title>
      </Head>
      <div className={styles.wrapper}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" href="/">
            Home
          </Link>
          <Typography color="textPrimary">{dbName}</Typography>
        </Breadcrumbs>
        <h1>{dbName}</h1>
        <p>{dbDesc}</p>
        <div className={styles.inputWrapper}>
          <TextField
            id="addTaskField"
            value={taskText}
            label="Add Task"
            onChange={(e) => setTaskTxt(e.target.value)}
          />
          &nbsp; &nbsp; &nbsp;
          <Button
            variant="contained"
            id="addBtn"
            color="primary"
            onClick={() => addTask(taskText)}
          >
            Add Task
          </Button>
        </div>
        <ul className={styles.listBox}>
          {loading ? (
            <p>loading</p>
          ) : (
            list.map((item, key) => (
              <Paper className={styles.listItem} key={key}>
                <Checkbox
                  icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                  checkedIcon={<CheckBoxIcon fontSize="small" />}
                  name="isTaskCompleted"
                  value={item.id}
                  id="rmTask" //!INFO: testing purpose
                  checked={false}
                  onChange={handleCompleteChange}
                />
                <p>{item.task}</p>
              </Paper>
            ))
          )}
          {loading ? (
            <div></div>
          ) : (
            completedList.map((item, key) => (
              <Paper className={styles.listItem} key={key}>
                <Checkbox
                  icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                  checkedIcon={<CheckBoxIcon fontSize="small" />}
                  name="isTaskCompleted"
                  value={item.id}
                  checked={item.checked}
                  onChange={handleCompleteChange}
                />
                <p>
                  <del>{item.task}</del>
                </p>
              </Paper>
            ))
          )}
        </ul>
      </div>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        message="Changes Saved Successfully 🎉️"
        action={
          <>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => setOpen(false)}
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
        onClick={() => saveData()} //TODO: implement save
      >
        <Save />
      </Fab>
    </>
  );
};

export default Lists;
