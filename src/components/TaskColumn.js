import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import TaskCard from "./TaskCard";

const TaskColumn = ({ status, tasks, onDelete }) => {
    return (
        <div style={{ padding: '0 8px' }}>
            <h2 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '16px',
                textAlign: 'center'
            }}>
                {status.label} ({tasks?.length || 0})
            </h2>

            <Droppable droppableId={status.key}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        style={{
                            backgroundColor: snapshot.isDraggingOver ? '#dbeafe' : '#f3f4f6',
                            borderRadius: '8px',
                            padding: '16px',
                            minHeight: '400px',
                            transition: 'background-color 0.2s ease',
                            border: snapshot.isDraggingOver ? '2px dashed #3b82f6' : '2px solid transparent'
                        }}
                    >
                        {(tasks || []).map((task, index) => (
                            <Draggable
                                key={task.id}
                                draggableId={task.id.toString()}
                                index={index}
                            >
                                {(provided, snapshot) => (
                                    <TaskCard
                                        task={task}
                                        index={index}
                                        onDelete={onDelete}
                                        statusKey={status.key}
                                        provided={provided}
                                        snapshot={snapshot}
                                    />
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}

                        {(!tasks || tasks.length === 0) && (
                            <div style={{
                                textAlign: 'center',
                                color: '#9ca3af',
                                fontSize: '14px',
                                fontStyle: 'italic',
                                padding: '40px 20px'
                            }}>
                                {snapshot.isDraggingOver ? 'Drop here...' : 'No tasks'}
                            </div>
                        )}
                    </div>
                )}
            </Droppable>
        </div>
    );
};

export default TaskColumn;