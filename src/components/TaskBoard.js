import React from "react";
import DroppableColumn from "./DroppableColumn";
import "../styles/TaskBoard.css";

const TaskBoard = ({ tasksByStatus, statuses, onDelete, overId, handleEditTask }) => {
    return (
        <div className="task-grid">
            {statuses?.map((status) => (
                <DroppableColumn
                    key={status.key}
                    status={status}
                    tasks={tasksByStatus[status.key]}
                    onDelete={onDelete}
                    handleEditTask={handleEditTask}
                    isOver={overId === status.key}
                />
            ))}
        </div>
    );
};

export default TaskBoard;
