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
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                transform: 'rotate(5deg)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
        >
            <p style={{ fontSize: '14px', color: '#374151', margin: '0 0 8px 0' }}>
                {task.description}
            </p>
            <p style={{ fontSize: '12px', color: '#9ca3af', margin: '4px 0' }}>
                Created: {new Date(task.createdAt).toLocaleString()}
            </p>
            <p style={{ fontSize: '12px', color: '#9ca3af', margin: '4px 0' }}>
                Updated: {task.updatedAt ? new Date(task.updatedAt).toLocaleString() : 'Never'}
            </p>
        </Card >
    );
};

export default TaskCard;