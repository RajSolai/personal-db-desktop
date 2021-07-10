const CreateDialog: React.FC<any> = ({
  isOpen,
  onNameChange,
  onDescChange,
  onTypeChange,
  onAddBtnClick,
  onCancelBtnClick,
}) => {
  return (
    <>
      <div
        style={{ visibility: isOpen ? "visible" : "hidden" }}
        className="z-10 flex p-3 flex-col rounded-md shadow-xl bg-gray-700 dialog backdrop-filter backdrop-grayscale"
      >
        <h2 className="text-white font-bold text-xl">Create New Database</h2>
        <input
          className="flex p-2 m-2 border-transparent rounded-md shadow-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600 bg-gray-800"
          type="text"
          onChange={onNameChange}
          placeholder="Enter Project Name"
          id="addProjectName"
        />
        <input
          className="flex p-2 m-2 border-transparent rounded-md shadow-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600 bg-gray-800"
          type="text"
          onChange={onDescChange}
          placeholder="Enter Project Description"
          id="addProjectDesc"
        />
        <select
          className="flex p-2 m-2 border-transparent rounded-md shadow-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600 bg-gray-800"
          name="dbType"
          onChange={onTypeChange}
          id="selectDbType"
        >
          <option className="bg-grey-800" value="list">
            List
          </option>
          <option value="project">Project</option>
        </select>
        <div className="flex flex-row text-white justify-end items-center">
          <button
            className="m-2 px-5 py-2 bg-red-400 rounded-md w-auto hover:bg-red-500 focus:ring ring-red-300"
            onClick={onCancelBtnClick}
          >
            Cancel
          </button>
          <button
            className="m-2 px-5 py-2 bg-green-500 rounded-md hover:bg-green-700 focus:ring ring-green-300"
            onClick={onAddBtnClick}
          >
            Create
          </button>
        </div>
      </div>
    </>
  );
};

export default CreateDialog;
