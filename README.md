# Social App

## Overview
This social app allows users to connect with each other through various features:
- **Users**: Create and manage personal profiles, add friends.
- **Posts**: Share posts, view, and interact with posts.
- **Comments & Reactions**: Engage with posts by commenting and reacting.
- **Friends**: Send and accept friend requests to grow your network.
- **Chats**: Real-time messaging with friends, powered by live chat features.

This app is designed to offer a rich social networking experience with real-time interactions.

---

## Setup Instructions

To get started with the project, follow these steps:

### Backend Setup
1. Navigate to the backend directory:
    ```bash
    cd backend
    ```
2. Install the dependencies:
    ```bash
    npm i
    ```
3. Start the backend server:
    ```bash
    npm run dev
    ```

### Frontend Setup
1. Navigate to the frontend directory:
    ```bash
    cd frontend/social
    ```
2. Install the dependencies:
    ```bash
    npm i
    ```
3. Start the frontend development server:
    ```bash
    npm start
    ```

---

## Technologies Used

### Backend
- **MongoDB**: NoSQL database to store social and user data.
- **Express**: Web framework for building REST APIs.
- **JWT & bcryptjs**: Used for authentication and securing user data.
- **Redis**: Caches user profiles for improved performance.
- **Socket.IO**: Enables real-time chatting functionality.
- **Message Queue (Bull)**: Handles the queuing of user messages and email notifications.

### Frontend
- **React**: Utilized for its component-based architecture and efficient rendering.
- **Bootstrap**: Provides a responsive and styled UI for the app.

---

## Deployment

The app is deployed using **Microsoft Azure**, ensuring scalability, performance, and security.
"""