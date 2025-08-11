import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableTaskCard from "./SortableTaskCard";
import { useDroppable } from "@dnd-kit/core";

const DroppableColumn = ({ status, tasks, onDelete, isOver, handleEditTask }) => {
    console.log(`DroppableColumn ${status.key} received tasks:`, tasks);

    // Use the useDroppable hook to make the entire column droppable
    const { setNodeRef: setDroppableRef, isOver: isDroppableOver } = useDroppable({
        id: status.key,
    });

    // Enhanced safety check and filter out invalid tasks
    if (!Array.isArray(tasks)) {
        console.error(`DroppableColumn ${status.key}: tasks is not an array:`, tasks);
        return (
            <div style={{ padding: '0 8px' }}>
                <h2 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '16px',
                    textAlign: 'center'
                }}>
                    {status.label} (Error)
                </h2>
                <div style={{ backgroundColor: '#ffebee', padding: '20px', borderRadius: '8px' }}>
                    Error: Invalid tasks data
                </div>
            </div>
        );
    }

    const validTasks = tasks.filter((task, index) => {
        if (!task) {
            console.error(`DroppableColumn ${status.key}: null/undefined task at index ${index}`);
            return false;
        }
        if (typeof task !== 'object') {
            console.error(`DroppableColumn ${status.key}: non-object task at index ${index}:`, task);
            return false;
        }
        if (!task.id) {
            console.error(`DroppableColumn ${status.key}: task missing ID at index ${index}:`, task);
            return false;
        }
        return true;
    });

    const taskIds = validTasks.map(task => String(task.id));

    console.log(`DroppableColumn ${status.key}: ${validTasks.length}/${tasks.length} valid tasks, IDs:`, taskIds);

    // Debug logging
    if (tasks.length !== validTasks.length) {
        console.warn(`DroppableColumn ${status.key}: Found ${tasks.length - validTasks.length} invalid tasks`);
    }

    const isColumnOver = isOver || isDroppableOver;

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

            <div
                ref={setDroppableRef}
                style={{
                    backgroundColor: isColumnOver ? '#dbeafe' : '#f3f4f6',
                    borderRadius: '8px',
                    padding: '16px',
                    minHeight: '400px',
                    transition: 'background-color 0.2s ease',
                    border: isColumnOver ? '2px dashed #3b82f6' : '2px solid transparent'
                }}
            >
                <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
                    {validTasks && validTasks.length > 0 ? (
                        validTasks.map((task, index) => {
                            try {
                                return (
                                    <SortableTaskCard
                                        key={String(task.id)}
                                        task={task}
                                        index={index}
                                        onDelete={onDelete}
                                        handleEditTask={handleEditTask}
                                        statusKey={status.key}
                                    />
                                );
                            } catch (error) {
                                console.error(`Error rendering SortableTaskCard for task ${task?.id}:`, error);
                                return (
                                    <div key={`error-${index}`} style={{
                                        padding: '10px',
                                        backgroundColor: '#ffebee',
                                        margin: '8px 0',
                                        borderRadius: '4px'
                                    }}>
                                        Error rendering task: {task?.title || 'Unknown'}
                                    </div>
                                );
                            }
                        })
                    ) : (
                        <div style={{
                            textAlign: 'center',
                            color: '#9ca3af',
                            fontSize: '14px',
                            fontStyle: 'italic',
                            padding: '40px 20px',
                            minHeight: '100px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {isColumnOver ? 'Drop here...' : 'No tasks'}
                        </div>
                    )}
                </SortableContext>
            </div>
        </div>
    );
};

export default DroppableColumn;