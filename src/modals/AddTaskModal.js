import React from "react";
import { Modal, Form, Input, Select } from "antd";
import { BUTTONS, VALIDATION_MESSAGES } from "../models/Task.constants";

const AddTaskModal = ({ isAddModalVisible, createTask, setIsAddModalVisible, form, statuses }) => {
    return (
        <Modal
            title={BUTTONS.ADD_TASK}
            open={isAddModalVisible}
            onOk={createTask}
            onCancel={() => {
                form.resetFields();
                setIsAddModalVisible(false);
            }}
        >
            <Form
                form={form}
                initialValues={{
                    status: 'backlog',
                }}
                layout="vertical">
                <Form.Item
                    name="title"
                    label="Title"
                    rules={[{ required: true, message: VALIDATION_MESSAGES.TITLE_ERROR }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: true, message: VALIDATION_MESSAGES.DESCRIPTION_ERROR }]}
                >
                    <Input.TextArea />
                </Form.Item>
                <Form.Item
                    name="status"
                    label="Status"
                    rules={[{ required: true, message: VALIDATION_MESSAGES.STATUS_ERROR }]}
                >
                    <Select disabled>
                        {statuses?.map(status => (
                            <Select.Option key={status.key} value={status.key}>
                                {status.label}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddTaskModal;
