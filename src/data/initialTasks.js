const initialTasks = {
    backlog: [
        {
            id: "task-1",
            title: "Setup Project Structure",
            description: "Initialize the project with proper folder structure and dependencies",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            id: "task-2",
            title: "Design Database Schema",
            description: "Create ERD and define database tables",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    ],
    todo: [
        {
            id: "task-3",
            title: "Implement Authentication",
            description: "Add user login and registration functionality",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    ],
    inprogress: [
        {
            id: "task-4",
            title: "Build Task Management UI",
            description: "Create drag and drop interface for task management",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    ],
    inQA: [
        {
            id: "task-6",
            title: "Test User Registration Flow",
            description: "Comprehensive testing of user registration and email verification",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    ],
    ready: [
        {
            id: "task-7",
            title: "Deploy Staging Environment",
            description: "Setup and configure staging environment for final testing",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    ],
    done: [
        {
            id: "task-5",
            title: "Setup Development Environment",
            description: "Configure development tools and environment",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    ],
};

export default initialTasks;
