export interface CardProps {
  id: string;
  taskName: string;
  onDrag: any;
  onDelete: any;
}

export interface ProjectDataBase {
  id: string;
  name: string;
  description: string;
  type: string;
  body: {
    notStarted: string[];
    progress: string[];
    completed: string[];
  };
}

export interface ListItemType {
  checked: boolean;
  id: string;
  task: string;
}

export interface ListDataType {
  id: string;
  name: string;
  description: string;
  type: string;
  body: {
    todoList: ListItemType[];
    completedList: ListItemType[];
  };
}
