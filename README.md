# Simple CRUD API Blog

This project is a simple CRUD API for a blog application. It includes functionalities for user login, creating posts, and adding comments.

## Features

- User authentication using JWT
- Create, read, update, and delete blog posts
- Add and read comments on posts

## Endpoints

### User

- `POST /register` - Register a user
- `POST /login` - Login a user
- `POST /logout` - Logout a user
- `POST /refresh` - Refresh user token
- `GET /users` - Get a user details


### Posts

- `POST /posts` - Create a new post
- `GET /posts` - Get all posts
- `GET /posts/:id` - Get a single post by ID
- `PATCH /posts/:id` - Update a post by ID
- `DELETE /posts/:id` - Delete a post by ID

### Comments

- `POST /posts/:postId/comments` - Add a comment to a post
- `GET /posts/:postId/comments` - Get all comments for a post

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/simple-crud-api-blog.git
    ```
2. Navigate to the project directory:
    ```sh
    cd simple-crud-api-blog
    ```
3. Install dependencies:
    ```sh
    npm install
    ```

## Usage

1. Start the server:
    ```sh
    npm start
    ```
2. Use an API client like Postman to interact with the endpoints.

*I am still learning, if there is a need to fix, please tell me.*