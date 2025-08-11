import React from "react";
import { Modal, Form, Input, Select } from "antd";
import { BUTTONS, VALIDATION_MESSAGES } from "../models/Task.constants";

const EditTaskModal = ({ isEditModalVisible, handleEditOk, setIsEditModalVisible, form, statuses, setEditingTask, editingTask }) => {
    return (
        <Modal
            title={BUTTONS.EDIT_TASK}
            open={isEditModalVisible}
            onOk={handleEditOk}
            onCancel={() => {
                form.resetFields();
                setEditingTask(null);
                setIsEditModalVisible(false);
            }}
        >
            <Form form={form} initialValues={editingTask} layout="vertical">
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
                    <Select>
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

export default EditTaskModal;
