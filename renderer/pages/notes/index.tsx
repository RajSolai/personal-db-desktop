import { useRef, useState } from "react";
import Save from "@material-ui/icons/Save";
import SnackBar from "../../components/snackbar";

const Notes: React.FC<any> = () => {
  const [open, setOpen] = useState<boolean>(false);
  const parentRef = useRef<any>();
  let keyword: String = "";
  const onSlashPress = (event) => {
    keyword.length <= 3 ? (keyword += event.key) : (keyword = "");
    console.log(keyword);
    const key: number = event.keyCode ? event.keyCode : event.which;
    console.log(key);
    if (key == 47) {
      event.preventDefault();
      if (keyword.trim() === "h1/") {
        const node: HTMLHeadingElement = document.createElement("h1");
        node.className = "block text-2xl font-bold";
        const textNode = document.createTextNode("New H1 Title");
        node.appendChild(textNode);
        parentRef.current.appendChild(node);
      } else if (keyword.trim() === "li/") {
        const node: HTMLLIElement = document.createElement("li");
        node.className = "block";
        const textNode = document.createTextNode("👉️ Add List Item");
        node.appendChild(textNode);
        parentRef.current.appendChild(node);
      } else if (keyword.trim() === "h2/") {
        const node: HTMLHeadingElement = document.createElement("h2");
        node.className = "block text-xl font-bold";
        const textNode = document.createTextNode("New H2 Title");
        node.appendChild(textNode);
        parentRef.current.appendChild(node);
      } else if (keyword.trim() === "d/") {
        const node: HTMLHRElement = document.createElement("hr");
        const paraNode: HTMLParagraphElement = document.createElement("p");
        const divNode: HTMLDivElement = document.createElement("div");
        const headNode: HTMLHeadingElement = document.createElement("h2");
        const headingText = document.createTextNode("New Section");
        paraNode.innerText = "Enter the New Block";
        headNode.className = "block text-xl font-bold";
        parentRef.current.appendChild(node);
        headNode.appendChild(headingText);
        divNode.appendChild(headNode);
        divNode.appendChild(paraNode);
        parentRef.current.appendChild(divNode);
      } else {
        console.log("nothing works");
      }
      console.log(keyword);
      keyword = "";
    }
  };
  return (
    <>
      <div className="m-8">
        <div
          ref={parentRef}
          contentEditable
          onKeyPress={onSlashPress}
          className="text-white"
        >
          <h1 className="block text-2xl font-bold">Untitled</h1>
          Add notes here
        </div>
        <SnackBar
          isOpen={open}
          content="Changes Saved Successfully 🎉️"
          onClose={() => setOpen(false)}
        />
        <button
          id="saveBtn"
          aria-label="add"
          className="flex p-3 bg-purple-600 transition rounded-md shadow-lg fab text-white hover:bg-purple-700 hover:rotate-45 focus:ring-2 ring-purple-400"
          onClick={() => console.log("sdf")}
        >
          <Save />
        </button>
      </div>
    </>
  );
};

export default Notes;
