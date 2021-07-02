import Head from "next/head";
import Breadcrumbs from "@material-ui/core/Breadcrumbs/Breadcrumbs";
import Typography from "@material-ui/core/Typography/Typography";
import Link from "@material-ui/core/Link/Link";
import { nanoid } from "nanoid";
import { Paper } from "@material-ui/core";
import TextField from "@material-ui/core/TextField/TextField";
import Button from "@material-ui/core/Button/Button";
import Checkbox from "@material-ui/core/Checkbox";
import { ListItemType } from "../../interfaces/props";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import Save from "@material-ui/icons/Save";
import Fab from "@material-ui/core/Fab/Fab";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import styles from "../../styles/Home.module.css";
import { useState, useEffect } from "react";

const Lists: React.FC<any> = () => {
  const [dbName, setDbName] = useState<string>("");
  const [taskText, setTaskTxt] = useState<string>("");
  const [list, setList] = useState<ListItemType[]>([]);
  const [completedList, setCompleted] = useState<ListItemType[]>([]);

  useEffect(() => {
    setList([
      { id: "id-1", task: "some task", checked: false },
      { id: "id-2", task: "some another task", checked: false },
    ]);
  }, []);

  const handleCompleteChange = (e: any) => {
    let thetask = list.find((item) => item.id == e.target.value);
    const remaining = list.filter((item) => item.id != e.target.value);
    setList(remaining);
    thetask!.checked = true;
    setCompleted([thetask!, ...completedList]);
  };

  const addTask = (task: string) => {
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
        <h1>{"dbName"}</h1>
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
          {list.map((item, key) => (
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
          ))}
          {completedList.map((item, key) => (
            <Paper className={styles.listItem} key={key}>
              <Checkbox
                icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                checkedIcon={<CheckBoxIcon fontSize="small" />}
                name="isTaskCompleted"
                checked={item.checked}
                onChange={handleCompleteChange}
              />
              <p>
                <del>{item.task}</del>
              </p>
            </Paper>
          ))}
        </ul>
      </div>
      <Fab
        color="primary"
        aria-label="add"
        className={styles.fab}
        onClick={() => console.log("useless")} //TODO: implement save
      >
        <Save />
      </Fab>
    </>
  );
};

export default Lists;
