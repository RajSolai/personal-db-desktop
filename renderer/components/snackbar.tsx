import Close from "@material-ui/icons/Close";

const SnackBar: React.FC<any> = ({ isOpen, onClose, content }) => {
  return (
    <div
      style={{ visibility: isOpen ? "visible" : "hidden" }}
      className="flex p-2 rounded-md items-center justify-center snackbar bg-gray-300"
    >
      <p>{content} </p>
      &nbsp;&nbsp;
      <button onClick={onClose} className="p-1 rounded-md hover:bg-gray-500">
        <Close />
      </button>
    </div>
  );
};

export default SnackBar;
