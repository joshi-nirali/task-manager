import React from "react";
import DroppableColumn from "./DroppableColumn";

const TaskBoard = ({ tasksByStatus, statuses, onDelete, overId, handleEditTask }) => {
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
            padding: '0 16px'
        }}>
            {statuses.map((status) => (
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
