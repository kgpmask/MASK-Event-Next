# MASK-Event-Next
> _The website for Open Campus Anime Quiz, 2024, but this time, in Next :)_

## Dependencies  
Here are some of the important dependencies used to bring this website to fruition:
- `axios`: An API used for sending HTTP requests and testing.
- `bcrypt`: A library to hash passwords.
- `mongoose`: An ORM used to work with MongoDB.
- `next`: A React-based framework for building server-side rendered and statically generated web applications.
- `react`: A library for building user interfaces, primarily focused on creating dynamic and reusable UI components.
- `socket.io`: A library that enables real-time, bidirectional communication between web clients and servers.

Here are the development dependencies used in the server:
- `eslint`: Used to analyse the code for neatness.
- `nodemon`: Used to run the server and restart the app on file updates.

> _Note: The server runs on Node.js v22. Make sure to update Node if it is not yet updated._

## Project Structure
```
Root
├── components                 # Reusable React components for UI
│   ├── Layout.js              # Common layout wrapper
│   ├── Login.js               # Login form component
│   ├── MainBody.js            # Main content container
│   └── [Subfolders]           # Other subfolders with specific components
│
├── database                   # Database-related files and configurations
│   ├── models                 # Mongoose schemas for database models
│   │   └── [Model files]      # e.g., User.js, Question.js, etc.
│   └── dbInit.js              # Database connection setup
│
├── pages                      # All application pages
│   ├── admin                  # Pages related to admin functionalities
│   │   └── [Admin pages]      # Admin dashboard, controls, etc.
│   ├── api                    # API routes
│   │   ├── live               # Routes related to fetching questions and response handling
│   │   ├── users
│   │   └── [...Other routes]  # Login, states, results, etc.
│   └── [...Other pages]       # Other pages like login, results etc.
│
├── public                     # Public assets (images, icons, etc.)
│   └── [...Static files]      # Static resources used in the project
│
├── styles                     # CSS modules for styling components
│   └── [...CSS files]         # e.g., Layout.module.css, Login.module.css, etc.
│
├── utils                      # Utility functions for server and client
│   └── [...Utility files]     # Caching, evaluation logic, etc.
│
├── server.js                  # Main server configuration and setup
├── socket.js                  # Socket.io setup for real-time communication
└── package.json               # Project dependencies and scripts
```

## Running the Website Locally
- Clone the repository onto your system.
- Navigate to the root directory, and run `npm i` to install all the necessary dependencies.
- Create a `.env` file in the root directory to store the environment variables necessary for the website to function properly. Include the following fields:
  ```
    MONGO_URL=<A valid MongoDB URL. An example includes mongodb://localhost:27017/<your_db_name>>
    QUIZ_ID=<A unique identifier for the quiz questions>
    QUES_NO=null
  ```
- Run either of the commands based on your requirements:
   1) `npm run dev` : To run the website in development mode with hot reloading and detailed error messages.
   2) `npm run build`, followed by `npm start` : For production. This builds the project for optimized performance, resulting in faster website responses and lower resource consumption.

## Contributions
The repository follows a two-branch workflow. The main branch is reserved for production releases, while the dev branch is used for active development and feature additions.
Non-trivial contributions should be made through pull requests (PRs) to the dev branch. Minor changes and bug fixes, however, can be directly committed to dev.

Note: PRs can target other feature-specific branches as well. For example, if you're working on the live quiz portal, you can create separate PRs for socket integration and database functionality within the live quiz portal branch. These branches can then be merged into dev.

Only PRs from dev to main are permitted to be merged into the main branch, ensuring that production releases are stable and tested.

## Pull Request Guidelines
When creating a new branch for a feature, open a pull request early—even as a draft—to easily track its progress.
Avoid using generic titles and descriptions. Clearly specify what the PR addresses and provide any necessary context.
Make sure the PR is targeted to the appropriate branch. For instance, avoid merging a PR intended for the live quiz portal branch directly into dev.
For a PR to be approved, feedback and suggestions provided by reviewers and the team lead should be addressed.

Note: When merging dev into main, ensure that all necessary database migrations are applied. If required, set the production server to maintenance mode before making changes.


## Contributors
### Team Head  
- [Ankan Saha](https://github.com/ItsAnkan)
### Executives  
- [Saroja Bamra](https://github.com/sarojabamra)
- [Sharanya Chakraborty](https://github.com/destryptor)
### Team Sub Head
- [Animesh Raj](https://github.com/wildcraft958)
### Associates
- [Arnab Jena](https://github.com/arnabara4)
- [Dalli Manideep](https://github.com/DalliMani)
- [Tridibesh Sarkar](https://github.com/tridibesh9)

