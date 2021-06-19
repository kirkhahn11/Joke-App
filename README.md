# joke-app

A full stack JavaScript application for comedians to save jokes and setlists.

## Technologies Used

- React.js
- Webpack 4
- Bootstrap 4
- Node.js
- PostgreSQL
- HTML5
- CSS3

## Live Demo

Try the application live at https://joke-setlist-creator.herokuapp.com/

## Features

- Users can create new jokes. 
- Users can edit previously saved jokes.
- Users can use old jokes to create setlists for shows.
- Users can add and delete jokes from previously saved setlists as they please.

## Preview

![miZFswAlqF](https://user-images.githubusercontent.com/68088188/122650293-a6de0600-d0f7-11eb-8588-7a334c97c1a7.gif)
![QT9a4Xgd0A](https://user-images.githubusercontent.com/68088188/122650330-e7d61a80-d0f7-11eb-8c2d-141ad3e30ab4.gif)

<img width="1079" alt="Screen Shot 2021-06-19 at 12 14 49 PM" src="https://user-images.githubusercontent.com/68088188/122650353-fd4b4480-d0f7-11eb-9694-8a128f413897.png">

## Development

### System Requirements

- Node.js 10 or higher
- NPM 6 or higher

### Getting Started

1. Clone the repository.

    ```shell
    git clone https://github.com/kirkhahn11/joke-app
    cd joke-app
    ```

1. Install all dependencies with NPM.

    ```shell
    npm install
    ```

1. Import the example database to MongoDB.

    ```shell
    pgweb --db=joke-app
    ```

1. Start the project. Once started you can view the application by opening http://localhost:3000 in your browser.

    ```shell
    npm run dev
    ```
