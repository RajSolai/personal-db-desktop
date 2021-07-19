import Head from "next/head";
import { useEffect, useState } from "react";
import axios from "axios/dist/axios";
import { useRouter } from "next/router";
import CreateDialog from "../../components/createdialog";
import SnackBar from "../../components/snackbar";
import { ProjectDataBase } from "../../interfaces/props";
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
      router.push("/dbs");
    }
  };
  return (
    <>
      <Head>
        <title>Personal Database</title>
      </Head>
      <div className="m-3">
        <h1 className="text-3xl font-bold text-white">Select Database</h1>
        {isLoading ? (
          <div>
            <p>Loading</p>
          </div>
        ) : (
          <div className="m-1 mt-7 flex flex-row flex-wrap">
            {databases.map((database, key) => (
              <div
                className="m-4 p-2 border-2 text-white rounded-lg select-none transition duration-200 w-1/5 hover:border-purple-600 hover:text-purple-600"
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
