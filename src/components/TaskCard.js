import React from "react";
import { Card } from "antd";

const TaskCard = ({ task }) => {
    return (
        <Card
            size="small"
            title={task.title}
            style={{
                backgroundColor: '#f0f9ff',
                border: '2px solid #3b82f6',
                transform: 'rotate(5deg)',
                boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
            }}
        >
            <p style={{ fontSize: '14px', color: '#374151', margin: '0 0 8px 0' }}>
                {task.description}
            </p>
            <p style={{ fontSize: '12px', color: '#9ca3af', margin: '4px 0' }}>
                Created: {new Date(task.createdAt).toLocaleString()}
            </p>
        </Card>
    );
};

export default TaskCard;