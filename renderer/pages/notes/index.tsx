import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Editor } from "@tinymce/tinymce-react";
import BreadCrumb from "../../components/breadcrumb";
import Save from "@material-ui/icons/Save";
import SnackBar from "../../components/snackbar";

const Notes: React.FC<any> = () => {
  const editorRef = useRef<any>(null);
  const [dbName, setDbName] = useState<string>("Database");
  const [dbEndPt, setEndPt] = useState<string>("");
  const [content, setContent] = useState<string>("<p>Loading.....</p>");
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    let currentDbString = localStorage.getItem("currentdb");
    let dbDetails = JSON.parse(currentDbString == null ? "" : currentDbString);
    const { dbname, dbendpoint } = dbDetails;
    setDbName(dbname);
    setEndPt(dbendpoint);
    axios
      .get<any>(
        `https://pdb-api.eu-gb.cf.appdomain.cloud/database/${dbendpoint}`,
        {
          headers: {
            "auth-token": localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        console.dir(res.data);
        setContent(res.data.content);
        // setList(res.data.body.todoList);
        // setCompleted(res.data.body.completedList);
      });
  }, []);
  const saveData = async () => {
    const data = {
      notesContent: editorRef.current.getContent(),
    };
    console.dir(data);
    const result = await axios.put(
      `https://pdb-api.eu-gb.cf.appdomain.cloud/notes/${dbEndPt}`,
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
  return (
    <>
      <div className="m-3">
        <BreadCrumb to="dbs" dbName={dbName} />
        <h1 className="m-1 text-white font-bold text-3xl">{dbName}</h1>
        <Editor
          apiKey="agzgtq7qkh7q3bvkt9uwl0z9s5i2b9a3es4svjrstw2kf26g"
          onInit={(evt, editor) => (editorRef.current = editor)}
          initialValue={content}
          init={{
            height: 800,
            menubar: false,
            plugins: [
              "advlist autolink lists link image charmap print preview anchor",
              "searchreplace visualblocks code fullscreen",
              "insertdatetime media table permanentpen paste code help wordcount",
            ],
            toolbar:
              "undo redo | formatselect | " +
              "bold italic backcolor | alignleft aligncenter " +
              "alignright alignjustify | bullist numlist outdent indent | " +
              "removeformat | permanentpen image",
            content_style:
              "body { background: #fff;font-family:Helvetica,Arial,sans-serif; font-size:14px }",
          }}
        />
        <SnackBar
          isOpen={open}
          content="Changes Saved Successfully 🎉️"
          onClose={() => setOpen(false)}
        />
        <button
          id="saveBtn"
          aria-label="add"
          className="flex p-3 bg-purple-600 transition rounded-md shadow-lg fab text-white hover:bg-purple-700 hover:rotate-45 focus:ring-2 ring-purple-400"
          onClick={() => saveData()}
        >
          <Save />
        </button>
      </div>
    </>
  );
};

export default Notes;
