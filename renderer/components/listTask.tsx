import React from "react";

export default function ListTask({ item, handleCompleteChange, isChecked }) {
  return (
    <>
      <div className="flex flex-row p-3 m-3 items-center bg-gray-700 rounded-md shadow-md">
        <input
          className="mr-3 checked:bg-purple-600 checked:border-transparent"
          type="checkbox"
          name="isTaskCompleted"
          value={item.id}
          checked={isChecked}
          onChange={handleCompleteChange}
        />
        <p className="text-white">
          {isChecked ? <del>{item.task}</del> : <>{item.task}</>}
        </p>
      </div>
    </>
  );
}
