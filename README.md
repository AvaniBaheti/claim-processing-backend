# Claim Processing Backend

This is a small backend project built with Node.js and Express.js. It provides authentication for users and payers. Payers can create insurances, users can claim them, and payers can review and update the statuses of those claims (APPROVED, REJECTED, FUNDED).

## Live Deployment

The project is deployed on Render.  
Live URL: **https://claim-processing-backend.onrender.com/**

## Features

- User and payer authentication using JWT
- Insurance creation by payers
- Claim submission by users
- Claim status management by payers
- PostgreSQL database (hosted on Supabase)
- Error logging using Winston
- Real-time alerts to Slack for critical failures
- Docker support for containerization
- CI/CD pipeline using GitHub Actions
- Environment-based configuration using `.env` file

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL (local or hosted)
- Docker (optional, for containerized setup)

### Installation

1. Clone the repository:
    git clone https://github.com/your-username/claim-processing-backend.git
    cd claim-processing-backend

2. Install dependencies:
    npm install

3. Create a `.env` file in the root directory and add the following environment variables:
    DB_PASSWORD= DB_HOST= DB_PORT= DB_NAME=postgres DB_USER= JWT_SECRET= JWT_EXPIRATION=1d SLACK_WEBHOOK_URL=

4. Start the server:
    npm run dev

   
    The server will run on port `5000` by default.
    
    ## API Routes
    
    All routes are prefixed with `/api`.  
    You can find the route definitions in `src/routes/index.js`.
    
    Examples:
    - `POST /api/auth/signup`
    - `POST /api/claim`
    - `GET /api/claim/:id`
    - `PATCH /api/claim/status/:id`
    
    ## Docker Support
    
    This project includes a Dockerfile for containerization.
    
    To build and run the container:
       docker build -t my-node-app 
       docker run -p 3000:5000 my-node-app

    ## Logging and Alerts
    
    - All application-level logs and errors are handled using Winston.
    - Daily log files are generated and rotated automatically.
    - Critical errors and unexpected behaviors are sent to a Slack channel using Slack Webhooks.
  
    ## CI/CD Pipeline
  
   CI/CD is configured using GitHub Actions. The workflow is triggered on every push to the `main` branch and performs the following steps:
  
  - Checks out the latest code
  - Installs dependencies
  - Builds the Docker image
  - Triggers a deployment on Render using a deploy hook
