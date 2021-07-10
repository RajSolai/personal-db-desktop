import Delete from "@material-ui/icons/Delete";
import { CardProps } from "../interfaces/props";

const TaskCard: React.FC<any> = (props: CardProps) => {
  return (
    <div
      className="flex m-2 bg-gray-700 rounded-md text-white flex-row p-3 items-center justify-between shadow-lg w-auto"
      id={props.id}
      draggable="true"
      onDragStart={props.onDrag}
    >
      <p>{props.taskName}</p>
      <button
        aria-label="delete"
        className="p-1 hover:bg-purple-600 rounded-md focus:ring ring-purple-800"
        onClick={props.onDelete}
      >
        <Delete />
      </button>
    </div>
  );
};

export default TaskCard;
