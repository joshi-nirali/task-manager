export const HEADER_CONTENT = {
    title: "Task Management Board",
};

export const DELETE_TASK_CONFIRMATION_TEXT = "Are you sure you want to delete this task? Once deleted, all related information will be lost and this action cannot be undone.";

export const BUTTONS = {
    ADD_TASK: "Add Task",
    EDIT_TASK: "Edit Task",
    DELETE_TASK: "Delete Task",
    CONFIRM_DELETE_TASK: "Yes, Delete",
    CANCEL: "Cancel"
};

export const STATUSES = [
    { key: "backlog", label: "Backlog" },
    { key: "todo", label: "To Do" },
    { key: "inprogress", label: "In Progress" },
    { key: "inQA", label: "In QA" },
    { key: "ready", label: "Ready for Live" },
    { key: "done", label: "Done" },
];

export const VALIDATION_MESSAGES = {
    TITLE_ERROR: "Please enter a title",
    DESCRIPTION_ERROR: "Please enter a description",
    STATUS_ERROR: "Please select a status",
    TASK_NOT_FOUND: "Original task not found",
    TASK_DELETED: "Task deleted successfully!",
    TASK_UPDATED: "Task updated successfully!",
    TASK_CREATED: "Task created successfully!",
    GLOBAL_VALIDATION_ERROR: "Please fill the required fields.",
    FIX_VALIDATIONS: "Please fix validation errors before saving.",
    NOTHING_TO_EDIT: "Nothing to edit",
    TASKS_EMPTY: "No tasks available",
};