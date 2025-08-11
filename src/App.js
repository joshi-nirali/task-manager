import React, { useEffect, useState } from "react";
import TaskBoard from "./components/TaskBoard";
import { Modal, Input, Button, message, Select, Layout, Form, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { closestCenter, DndContext, DragOverlay, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import TaskCard from "./components/TaskCard";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";

const { Header, Content } = Layout;
const { Title } = Typography;

const App = () => {
  const [activeId, setActiveId] = useState(null);
  const [overId, setOverId] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const [tasksByStatus, setTasksByStatus] = useState({
    backlog: [
      {
        id: "task-1",
        title: "Setup Project Structure",
        description: "Initialize the project with proper folder structure and dependencies",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "task-2",
        title: "Design Database Schema",
        description: "Create ERD and define database tables",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    todo: [
      {
        id: "task-3",
        title: "Implement Authentication",
        description: "Add user login and registration functionality",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    inprogress: [
      {
        id: "task-4",
        title: "Build Task Management UI",
        description: "Create drag and drop interface for task management",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    inQA: [
      {
        id: "task-6",
        title: "Test User Registration Flow",
        description: "Comprehensive testing of user registration and email verification",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    ready: [
      {
        id: "task-7",
        title: "Deploy Staging Environment",
        description: "Setup and configure staging environment for final testing",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    done: [
      {
        id: "task-5",
        title: "Setup Development Environment",
        description: "Configure development tools and environment",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  });

  const statuses = [
    { key: "backlog", label: "Backlog" },
    { key: "todo", label: "To Do" },
    { key: "inprogress", label: "In Progress" },
    { key: "inQA", label: "In QA" },
    { key: "ready", label: "Ready for Live" },
    { key: "done", label: "Done" }
  ];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findTask = (id) => {
    if (!id) return null;
    for (const statusKey of Object.keys(tasksByStatus)) {
      const tasks = tasksByStatus[statusKey];
      if (!tasks) continue;
      const task = tasks.find(task => task && task.id === id);
      if (task) {
        return { task, statusKey };
      }
    }
    return null;
  };

  const findColumn = (id) => {
    if (!id) return null;
    if (tasksByStatus[id]) {
      return id;
    }
    for (const statusKey of Object.keys(tasksByStatus)) {
      const tasks = tasksByStatus[statusKey];
      if (!tasks) continue;
      const taskExists = tasks.find(task => task && task.id === id);
      if (taskExists) {
        return statusKey;
      }
    }
    return null;
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) {
      setOverId(null);
      return;
    }
    const activeColumn = findColumn(active.id);
    let overColumn = findColumn(over.id);

    if (!overColumn && tasksByStatus[over.id]) {
      overColumn = over.id;
    }
    setOverId(overColumn);
    if (activeColumn && overColumn && activeColumn !== overColumn) {
      setTasksByStatus(prev => {
        const activeItems = [...prev[activeColumn]];
        const overItems = [...prev[overColumn]];
        const activeIndex = activeItems.findIndex(item => item.id === active.id);
        const activeTask = activeItems[activeIndex];
        if (!activeTask) return prev;
        activeItems.splice(activeIndex, 1);

        let insertIndex = overItems.length;
        if (over.id !== overColumn) {
          const overIndex = overItems.findIndex(item => item.id === over.id);
          if (overIndex >= 0) {
            insertIndex = overIndex;
          }
        }

        overItems.splice(insertIndex, 0, {
          ...activeTask,
          updatedAt: new Date().toISOString()
        });

        return {
          ...prev,
          [activeColumn]: activeItems,
          [overColumn]: overItems,
        };
      });
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    setOverId(null);
    if (!over) return;
    const activeColumn = findColumn(active.id);
    let overColumn = findColumn(over.id);

    if (!overColumn && tasksByStatus[over.id]) {
      overColumn = over.id;
    }

    if (!activeColumn || !overColumn) return;

    if (activeColumn === overColumn) {
      setTasksByStatus(prev => {
        const items = [...prev[activeColumn]];
        const oldIndex = items.findIndex(item => item.id === active.id);

        let newIndex = oldIndex;
        if (over.id !== active.id) {
          newIndex = items.findIndex(item => item.id === over.id);
        }

        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
          const reorderedItems = arrayMove(items, oldIndex, newIndex);
          return {
            ...prev,
            [activeColumn]: reorderedItems.map(item => ({
              ...item,
              updatedAt: new Date().toISOString()
            }))
          };
        }
        return prev;
      });
    }

    const targetStatus = statuses.find(s => s.key === overColumn);
    if (targetStatus && activeColumn !== overColumn) {
      message.success(`Task moved to ${targetStatus.label}`);
    }
  };

  const onDelete = (statusKey, taskIndex) => {
    Modal.confirm({
      title: 'Delete Task',
      content: 'Are you sure you want to delete this task?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        setTasksByStatus(prev => ({
          ...prev,
          [statusKey]: prev[statusKey].filter((_, index) => index !== taskIndex)
        }));
        message.success('Task deleted successfully');
      }
    });
  };

  const handleAddTask = () => {
    setEditingTask(null);
    addForm.resetFields();
    setIsModalVisible(true);
  };

  const onEdit = (statusKey, taskIndex, updatedTask) => {
    setTasksByStatus(prev => ({
      ...prev,
      [statusKey]: prev[statusKey].map((task, index) =>
        index === taskIndex ? { ...task, ...updatedTask, updatedAt: new Date().toISOString() } : task
      )
    }));
    setEditingTask(null);
    editForm.resetFields();
    setIsEditModalVisible(false);
    message.success('Task updated successfully');
  };

  const handleEditTask = (statusKey, taskIndex, task) => {
    setEditingTask({ ...task, statusKey, taskIndex, status: statusKey });
    setIsEditModalVisible(true);
  };

  // const handleModalOk = () => {
  //   form.validateFields()
  //     .then(values => {
  //       const newTask = {
  //         id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  //         title: values.title,
  //         description: values.description,
  //         createdAt: new Date().toISOString(),
  //         updatedAt: new Date().toISOString()
  //       };

  //       setTasksByStatus(prev => ({
  //         ...prev,
  //         [values.status]: [...prev[values.status], newTask]
  //       }));

  //       form.resetFields();
  //       setIsModalVisible(false);
  //       message.success('Task added successfully');
  //     })
  //     .catch(errorInfo => {
  //       console.log('Validation failed:', errorInfo);
  //     });
  // };

  // const handleModalCancel = () => {
  //   form.resetFields();
  //   setIsModalVisible(false);
  // };

  useEffect(() => {
    if (editingTask) {
      editForm.setFieldsValue(editingTask);
    }
  }, [editingTask, editForm]);

  const activeTask = activeId ? findTask(activeId)?.task : null;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ backgroundColor: '#ffffff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px'
        }}>
          <Title level={3} style={{ margin: 0, color: '#2563eb' }}>
            Task Management Board
          </Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddTask}
            size="large"
          >
            Add Task
          </Button>
        </div>
      </Header>

      <Content style={{ padding: '24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <TaskBoard
              tasksByStatus={tasksByStatus}
              statuses={statuses}
              onDelete={onDelete}
              handleEditTask={handleEditTask}
              overId={overId}
            />
            <DragOverlay>
              {activeTask ? <TaskCard task={activeTask} /> : null}
            </DragOverlay>
          </DndContext>
        </div>
      </Content>

      <Modal
        title="Add Task"
        open={isModalVisible}
        onOk={() => {
          addForm.validateFields().then(values => {
            const { title, description, status } = values;

            const newTask = {
              id: Date.now(),
              title,
              description,
              status,
              createdAt: new Date().toISOString(),
            };

            setTasksByStatus(prev => ({
              ...prev,
              [status]: [...prev[status], newTask],
            }));

            addForm.resetFields();
            setIsModalVisible(false);
          });
        }}
        onCancel={() => {
          addForm.resetFields();
          setIsModalVisible(false);
        }}
      >
        <Form form={addForm} initialValues={{ status: 'backlog' }} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please enter a title' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter a description' }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select a status' }]}
          >
            <Select>
              {statuses.map(status => (
                <Select.Option key={status.key} value={status.key}>
                  {status.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Edit Task"
        open={isEditModalVisible}
        onOk={() => {
          editForm.validateFields().then(values => {
            const { title, description, status } = values;
            const { statusKey, taskIndex } = editingTask;

            onEdit(statusKey, taskIndex, { title, description, status });
            setEditingTask(null);
            setIsEditModalVisible(false);
          });
        }}
        onCancel={() => {
          editForm.resetFields();
          setEditingTask(null);
          setIsEditModalVisible(false);
        }}
      >
        <Form form={editForm} initialValues={editingTask} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please enter a title' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter a description' }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select a status' }]}
          >
            <Select>
              {statuses.map(status => (
                <Select.Option key={status.key} value={status.key}>
                  {status.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default App;