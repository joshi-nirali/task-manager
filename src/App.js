import React, { useEffect, useState } from "react";
import TaskBoard from "./components/TaskBoard";
import { Modal, Button, message, Layout, Form, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { closestCenter, DndContext, DragOverlay, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import TaskCard from "./components/TaskCard";
import { v4 as uuidv4 } from 'uuid';
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import AddTaskModal from "./modals/AddTaskModal";
import EditTaskModal from "./modals/EditTaskModal";
import { BUTTONS, DELETE_TASK_CONFIRMATION_TEXT, HEADER_CONTENT, STATUSES, VALIDATION_MESSAGES } from "./models/Task.constants";
import initialTasks from "./data/initialTasks";

const { Header, Content } = Layout;
const { Title } = Typography;

const App = () => {
  const [activeId, setActiveId] = useState(null);
  const [overId, setOverId] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const [tasksByStatus, setTasksByStatus] = useState(() => {
    const savedTasks = localStorage.getItem("tasksByStatus");
    return savedTasks
      ? JSON.parse(savedTasks)
      : initialTasks;
  });

  useEffect(() => {
    localStorage.setItem("tasksByStatus", JSON.stringify(tasksByStatus));
  }, [tasksByStatus]);

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

    const targetStatus = STATUSES?.find(s => s.key === overColumn);
    if (targetStatus && activeColumn !== overColumn) {
      message.success(`Task moved to ${targetStatus.label}`);
    }
  };

  const showDeleteModal = (statusKey, index) => {
    setTaskToDelete({ statusKey, index });
    setIsDeleteModalVisible(true);
  };

  const handleConfirmDelete = () => {
    if (taskToDelete) {
      const { statusKey, index } = taskToDelete;
      setTasksByStatus(prev => {
        const updated = { ...prev };
        updated[statusKey] = [...updated[statusKey]];
        updated[statusKey].splice(index, 1);
        return updated;
      });
    }
    setIsDeleteModalVisible(false);
    message.success(VALIDATION_MESSAGES.TASK_DELETED);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
    setTaskToDelete(null);
  };


  const handleAddTask = () => {
    addForm.resetFields();
    setIsAddModalVisible(true);
  };

  const createTask = async () => {
    try {
      const values = await addForm.validateFields();
      const { title, description, status = "backlog" } = values;

      const newTask = {
        id: uuidv4(),
        title,
        description,
        status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setTasksByStatus((prev) => ({
        ...prev,
        [status]: [...prev[status], newTask],
      }));

      addForm.resetFields();
      setIsAddModalVisible(false);
      message.success(VALIDATION_MESSAGES.TASK_CREATED);
    } catch (err) {
      message.error(VALIDATION_MESSAGES.GLOBAL_VALIDATION_ERROR);
    }
  };

  const handleEditOk = async () => {
    try {
      const values = await editForm.validateFields();
      const { title, description, status = "backlog" } = values;

      if (!editingTask) {
        message.error(VALIDATION_MESSAGES.NOTHING_TO_EDIT);
        return;
      }

      const { statusKey: oldStatusKey, taskIndex } = editingTask;
      if (taskIndex < 0 || !tasksByStatus[oldStatusKey]) {
        message.error(VALIDATION_MESSAGES.TASK_NOT_FOUND);
        return;
      }

      const oldTask = tasksByStatus[oldStatusKey]?.[taskIndex];
      if (!oldTask) {
        message.error(VALIDATION_MESSAGES.TASK_NOT_FOUND);
        return;
      }

      const updatedTask = {
        ...oldTask,
        title,
        description,
        status,
        updatedAt: new Date().toISOString(),
      };

      setTasksByStatus((prev) => {
        const copy = { ...prev };

        copy[oldStatusKey] = [...copy[oldStatusKey]];
        copy[oldStatusKey].splice(taskIndex, 1);

        copy[status] = [...(copy[status] || []), updatedTask];

        return copy;
      });

      editForm.resetFields();
      setEditingTask(null);
      setIsEditModalVisible(false);
      message.success(VALIDATION_MESSAGES.TASK_UPDATED);
    } catch (err) {
      message.error(VALIDATION_MESSAGES.FIX_VALIDATIONS);
    }
  };

  const handleEditTask = (statusKey, taskIndex, task) => {
    setEditingTask({ ...task, statusKey, taskIndex, status: statusKey });
    setIsEditModalVisible(true);
  };

  useEffect(() => {
    if (editingTask) {
      editForm.setFieldsValue(editingTask);
    }
  }, [editingTask, editForm]);

  const activeTask = activeId ? findTask(activeId)?.task : null;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 1000,
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          height: '100%',
          maxWidth: '1500px',
        }}>
          <Title level={3} style={{
            margin: 0,
            color: '#2563eb',
            fontSize: 'clamp(1rem, 2vw + 0.5rem, 1.75rem)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {HEADER_CONTENT.title}
          </Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddTask}
            size="large"
          >
            {BUTTONS.ADD_TASK}
          </Button>
        </div>
      </Header>

      <Content style={{ padding: '24px', marginTop: '64px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <TaskBoard
              tasksByStatus={tasksByStatus}
              statuses={STATUSES}
              onDelete={showDeleteModal}
              handleEditTask={handleEditTask}
              overId={overId}
            />
            <DragOverlay>
              {activeTask ? <TaskCard task={activeTask} /> : null}
            </DragOverlay>
          </DndContext>
        </div>
      </Content>

      <AddTaskModal
        form={addForm}
        isAddModalVisible={isAddModalVisible}
        setIsAddModalVisible={setIsAddModalVisible}
        createTask={createTask}
      />

      <EditTaskModal
        isEditModalVisible={isEditModalVisible}
        handleEditOk={handleEditOk}
        setIsEditModalVisible={setIsEditModalVisible}
        form={editForm}
        statuses={STATUSES}
        setEditingTask={setEditingTask}
        editingTask={editingTask}
      />

      <Modal
        title={BUTTONS.DELETE_TASK}
        open={isDeleteModalVisible}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
        okText={BUTTONS.CONFIRM_DELETE_TASK}
        okType="danger"
        cancelText={BUTTONS.CANCEL}
      >
        <p>{DELETE_TASK_CONFIRMATION_TEXT}</p>
      </Modal>
    </Layout>
  );
};

export default App;