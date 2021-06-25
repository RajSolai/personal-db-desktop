import IconButton from "@material-ui/core/IconButton/IconButton";
import Card from "@material-ui/core/Card/Card";
import Delete from "@material-ui/icons/Delete";
import styles from "../styles/Home.module.css";
import { CardProps } from "../interfaces/props";

const TaskCard:React.FC<any> = (props:CardProps) => {
  return (
    <Card
      elevation={2}
      className={styles.card}
      id={props.id}
      draggable="true"
      onDragStart={props.onDrag}
    >
      <span>{props.taskName}</span>
      <IconButton aria-label="delete" onClick={props.onDelete}>
        <Delete/>
      </IconButton>
    </Card>
  );
};

export default TaskCard;
