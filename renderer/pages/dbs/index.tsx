import Head from "next/head";
import { useEffect, useState } from "react";
import axios from "axios/dist/axios";
import Lists from "./lists";
import { Player } from "@lottiefiles/react-lottie-player";
import CreateDialog from "../../components/createdialog";
import Delete from "@material-ui/icons/Delete";
import SnackBar from "../../components/snackbar";
import { db, ProjectDataBase } from "../../interfaces/props";
import AddRounded from "@material-ui/icons/AddRounded";
import Notes from "./notes";
import Project from "./project";

export default function Home() {
  const [currentType, setCurrType] = useState("");
  const [currentDb, setCurrDb] = useState<db>({
    dbname: "dbName",
    dbdesc: "dbDesc",
    dbendpoint: "dbId",
  });
  const [open, setOpen] = useState<boolean>(false);
  const [snackOpen, setSnackOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [type, setType] = useState<string>("project");
  const [databases, setDataBases] = useState<ProjectDataBase[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);

  const getData = async () => {
    const res = await axios.get("https://pdb-api.eu-gb.cf.appdomain.cloud/", {
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

  const removeProject = (id) => {
    axios
      .delete(`https://pdb-api.eu-gb.cf.appdomain.cloud/database/${id}`, {
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      })
      .then(() => getData());
  };

  const addProject = async () => {
    setOpen(false);
    const data = {
      name: name,
      type: type,
      desc: desc,
    };
    const res = await axios.post(
      `https://pdb-api.eu-gb.cf.appdomain.cloud/${type}`,
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

  const changeView = (
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
    console.log("clicked");
    setCurrDb(currentDb);
    setCurrType(dbType);
  };

  if (isLoading) {
    return (
      <>
        <Head>
          <title>Loading</title>
        </Head>
        <div className="flex align-center mt-12 items-center justify-center">
          <div>
            <Player
              autoplay
              loop
              src="https://assets10.lottiefiles.com/packages/lf20_F7WfWB.json"
            ></Player>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <Head>
          <title>Personal Database</title>
        </Head>
        <div className="flex flex-row">
          <div className="m-0 p-2 flex flex-col side-bar custom-scroll bg-gray-800">
            <button
              color="primary"
              aria-label="add"
              className="flex p-3 mb-3 rounded-md text-white bg-gradient-to-b from-purple-800 via-violet-900 to-purple-800"
              onClick={() => setOpen(true)}
            >
              <AddRounded />
              &nbsp;
              <span>Create New</span>
            </button>
            {databases.map((database, key) => (
              <div
                className="mb-2 p-1 text-white rounded-md flex justify-between bg-gray-700"
                key={key}
              >
                <h2
                  className="m-1 font-bold text-xl cursor-pointer"
                  onClick={() =>
                    changeView(
                      database.description,
                      database.type,
                      database.name,
                      database.id
                    )
                  }
                >
                  {database.name}
                </h2>
                <button
                  aria-label="delete"
                  className="p-1 hover:bg-purple-600 rounded-md focus:ring ring-purple-800"
                  onClick={() => removeProject(database.id)}
                >
                  <Delete />
                </button>
              </div>
            ))}
          </div>
          <div className="content-view text-white custom-scroll">
            {currentType == "notes" ? (
              <Notes
                dbEndPt={currentDb!.dbendpoint}
                dbName={currentDb!.dbname}
              />
            ) : currentType == "list" ? (
              <Lists
                dbDesc={currentDb!.dbdesc}
                dbEndPt={currentDb!.dbendpoint}
                dbName={currentDb!.dbname}
              />
            ) : currentType == "project" ? (
              <Project
                dbDesc={currentDb!.dbdesc}
                dbEndPt={currentDb!.dbendpoint}
                dbName={currentDb!.dbname}
              />
            ) : (
              // animation
              <div className="flex align-center mt-12 items-center justify-center">
                <div>
                  <Player
                    autoplay
                    loop
                    src="https://assets7.lottiefiles.com/packages/lf20_1pxqjqps.json"
                    style={{ width: "300px", height: "300px" }}
                  ></Player>
                  <h2 className="m-0 p-0 text-lg font-bold">
                    Select Any Database To Work On !
                  </h2>
                </div>
              </div>
            )}
          </div>
        </div>
        <CreateDialog
          isOpen={open}
          onNameChange={(e) => setName(e.target.value)}
          onDescChange={(e) => setDesc(e.target.value)}
          onTypeChange={(e) => setType(e.target.value)}
          onAddBtnClick={() => addProject()}
          onCancelBtnClick={() => setOpen(false)}
        />
        <SnackBar
          isOpen={snackOpen}
          content="Database Created Successfully"
          onClose={() => setSnackOpen(false)}
        />
      </>
    );
  }
}
