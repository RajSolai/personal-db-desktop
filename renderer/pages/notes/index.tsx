import { useRef } from "react";

const Notes: React.FC<any> = (props: any) => {
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
        console.log("fuck");
      }
      console.log(keyword);
      keyword = "";
    }
  };
  return (
    <>
      <div className="m-5">
        <div
          ref={parentRef}
          contentEditable
          onKeyPress={onSlashPress}
          className="text-white"
        >
          <h1 className="block text-2xl font-bold">Untitled</h1>
          add notes here
        </div>
      </div>
    </>
  );
};

export default Notes;
