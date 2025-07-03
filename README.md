# Job Application Portal

A Full-Stack MERN Application for Managing Job Applications

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Installation](#installation)
    - [Backend Setup](#backend-setup)
    - [Frontend Setup](#frontend-setup)
5. [Usage](#usage)
6. [Contributing](#contributing)
7. [License](#license)
8. [Contact](#contact)

## Introduction

The **Job Application Portal** is a web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js). It allows job seekers to browse and apply for job opportunities while enabling recruiters to post jobs and manage applications efficiently.

## Features

- 🔐 **User Authentication**: Register/login functionality for both applicants and recruiters with secure JWT-based authentication.
- 💼 **Job Listings**: Applicants can view all available job openings.
- 📄 **Job Application System**: Submit applications with a resume and personal message.
- 🧑‍💼 **Recruiter Dashboard**: Post, update, and delete job postings.
- 📊 **Application Management**: View applications, and update statuses (accepted/rejected).
- 📧 **Email Notifications** *(Optional Enhancement)*: Get notified on application status changes.
- 📁 **File Upload Support** *(Optional Enhancement)*: Upload resumes using Multer/GridFS.

## Technologies Used

- **Frontend**: React.js, HTML5, CSS3, JavaScript, Bootstrap/Tailwind CSS (customizable)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **API Communication**: Axios
- **Authentication**: JWT, bcrypt
- **Tools**: Postman, Git, GitHub

## Installation

### Backend Setup

1. Clone the repository and navigate to the `backend` folder:
    ```bash
    git clone https://github.com/your-username/job-application-portal.git
    cd job-application-portal/backend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the backend root with the following variables:
    ```env
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_secret_key
    PORT=5000
    ```

4. Start the backend server:
    ```bash
    npm start
    ```

### Frontend Setup

1. Navigate to the `frontend` folder:
    ```bash
    cd ../frontend
    ```

2. Install frontend dependencies:
    ```bash
    npm install
    ```

3. Start the React development server:
    ```bash
    npm start
    ```

4. Open your browser and go to: [http://localhost:3000](http://localhost:3000)

## Usage

- Visit the homepage.
- Register as either a **Job Applicant** or **Recruiter**.
- Applicants can:
  - Browse job listings
  - Submit applications
- Recruiters can:
  - Post new job openings
  - View and manage applications

> **Tip**: Admin-level control or analytics can be added for superusers.

## Contributing

Contributions are welcome and encouraged!

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`)
3. Make your changes and commit (`git commit -m "Add feature"`)
4. Push to your fork (`git push origin feature-name`)
5. Submit a pull request!

> **Note**: Please follow the existing code style and structure. Add relevant comments and test your changes thoroughly.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

**JAJULA KISHORE NANDHAN**  
🔗 [LinkedIn](https://linkedin.com/in/jajula-kishore-nandhan)  
📫 Feel free to reach out for collaboration, feedback, or any questions!

---

Let me know if you'd like a downloadable `.md` file version or to push this to GitHub directly.
