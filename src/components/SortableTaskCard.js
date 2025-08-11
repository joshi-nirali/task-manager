import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button, Card, Space, Tooltip } from "antd";

const SortableTaskCard = ({ task, index, onDelete, statusKey, handleEditTask }) => {
    const taskId = task?.id ? String(task.id) : `invalid-task-${index}`;

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: taskId });

    console.log('SortableTaskCard props:', { task, index, onDelete: !!onDelete, statusKey });

    if (!task) {
        console.error('SortableTaskCard: task is null/undefined');
        return (
            <div ref={setNodeRef} style={{ padding: '10px', backgroundColor: '#ffebee', marginBottom: '12px' }}>
                Error: Invalid task
            </div>
        );
    }

    if (typeof task !== 'object') {
        console.error('SortableTaskCard: task is not an object:', typeof task, task);
        return (
            <div ref={setNodeRef} style={{ padding: '10px', backgroundColor: '#ffebee', marginBottom: '12px' }}>
                Error: Task is not an object
            </div>
        );
    }

    if (!task.id) {
        console.error('SortableTaskCard: task.id is missing:', task);
        return (
            <div ref={setNodeRef} style={{ padding: '10px', backgroundColor: '#ffebee', marginBottom: '12px' }}>
                Error: Task missing ID
            </div>
        );
    }

    console.log('Using task ID:', taskId);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        marginBottom: '12px',
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Card
                size="small"
                title={task.title || "Untitled Task"}
                extra={
                    <Space size="small">
                        <Tooltip title="Edit Task">
                            <Button
                                type="default"
                                shape="circle"
                                icon={<EditOutlined />}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditTask(statusKey, index, task);
                                }}
                                onPointerDown={(e) => e.stopPropagation()}
                            />
                        </Tooltip>
                        <Tooltip title="Delete Task">
                            <Button
                                danger
                                type="default"
                                shape="circle"
                                icon={<DeleteOutlined />}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete && onDelete(statusKey, index);
                                }}
                                onPointerDown={(e) => e.stopPropagation()}
                            />
                        </Tooltip>
                    </Space>
                }
                style={{
                    backgroundColor: isDragging ? "#f0f9ff" : "#ffffff",
                    border: isDragging ? "2px solid #3b82f6" : "1px solid #d1d5db",
                    cursor: isDragging ? "grabbing" : "grab",
                }}
            >
                <p style={{ fontSize: "14px", color: "#374151", margin: "0 0 8px 0" }}>
                    {task.description || "No description"}
                </p>
                <p style={{ fontSize: "12px", color: "#9ca3af", margin: "4px 0" }}>
                    Created: {task.createdAt ? new Date(task.createdAt).toLocaleString() : "Unknown"}
                </p>
                <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>
                    Updated: {task.updatedAt ? new Date(task.updatedAt).toLocaleString() : "Unknown"}
                </p>
            </Card>
        </div>
    );
};

export default SortableTaskCard;