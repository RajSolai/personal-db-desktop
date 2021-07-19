import Head from "next/head";
import axios from "axios/dist/axios";
import { nanoid } from "nanoid";
import { ListDataType, ListItemType } from "../../interfaces/props";
import BreadCrumb from "../../components/breadcrumb";
import Save from "@material-ui/icons/Save";
import SnackBar from "../../components/snackbar";
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
        `https://pdb-api.eu-gb.cf.appdomain.cloud/database/${dbendpoint}`,
        {
          headers: {
            "auth-token": localStorage.getItem("token"),
          },
        }
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
      `https://pdb-api.eu-gb.cf.appdomain.cloud/list/${dbEndPt}`,
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
      <div className="m-5">
        <BreadCrumb to="dbs" dbName={dbName} />
        <h1 className="m-1 text-white font-bold text-3xl">{dbName}</h1>
        <p className="m-1 text-white text-base">{dbDesc}</p>
        <div className="flex justify-center item-center content-center">
          <input
            className="flex p-2 border-transparent rounded-md shadow-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600 bg-gray-800"
            type="text"
            id="addTaskField"
            value={taskText}
            placeholder="Enter new task"
            onChange={(e) => setTaskTxt(e.target.value)}
          />
          &nbsp; &nbsp; &nbsp;
          <button
            className="p-3 m-1 shadow-md rounded-md text-white bg-purple-600 transition duration-200 focus:ring focus:ring-purple-600 focus:ring-opacity-50 hover:bg-purple-700"
            id="addBtn"
            color="primary"
            onClick={() => addTask(taskText)}
          >
            Add Task
          </button>
        </div>
        <ul className="mx-20 justify-center content-center">
          {loading ? (
            <p>loading</p>
          ) : (
            list.map((item, key) => (
              <div
                className="flex flex-row p-3 m-3 items-center bg-gray-700 rounded-md shadow-md"
                key={key}
              >
                <input
                  className="mr-3 checked:bg-blue-600 checked:border-transparent"
                  type="checkbox"
                  name="isTaskCompleted"
                  value={item.id}
                  id="rmTask" //!INFO: testing purpose
                  checked={false}
                  onChange={handleCompleteChange}
                />
                <p className="text-white">{item.task}</p>
              </div>
            ))
          )}
          {loading ? (
            <div></div>
          ) : (
            completedList.map((item, key) => (
              <div
                className="flex flex-row p-3 m-3 items-center bg-gray-700 rounded-md shadow-md"
                key={key}
              >
                <input
                  className="mr-3 checked:bg-purple-600 checked:border-transparent"
                  type="checkbox"
                  name="isTaskCompleted"
                  value={item.id}
                  checked={true}
                  onChange={handleCompleteChange}
                />
                <p className="text-white">
                  <del>{item.task}</del>
                </p>
              </div>
            ))
          )}
        </ul>
      </div>
      <SnackBar
        isOpen={open}
        content="Changes Saved Successfully 🎉️"
        onClose={() => setOpen(false)}
      />
      <button
        id="saveBtn"
        aria-label="add"
        className="flex p-3 bg-purple-600 transition rounded-md shadow-lg fab text-white hover:bg-purple-700 hover:rotate-45"
        onClick={() => saveData()}
      >
        <Save />
      </button>
    </>
  );
};

export default Lists;
