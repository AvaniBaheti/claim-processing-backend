# Claim Processing Backend

This is a backend project built with Node.js, Express and PostgreSQL. It provides authentication for users and payers. Payers can create insurances, users can claim them, and payers can review and update the statuses of those claims (PENDING, APPROVED, REJECTED, FUNDED).

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
```bash
git clone https://github.com/AvaniBaheti/claim-processing-backend.git
cd claim-processing-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add the following environment variables:
```bash
DB_PASSWORD= 
DB_HOST= 
DB_PORT= 
DB_NAME=postgres 
DB_USER= 
JWT_SECRET= 
JWT_EXPIRATION=1d 
SLACK_WEBHOOK_URL=
```

4. Start the server:
```bash
npm run dev
```
    The server will run on port `5000` by default.
    

## API Reference

#### Health Check

```http
  GET /
```

#### User Sign-up

```http
  POST /api/auth/signup
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `name`      | `string` | **Required**. Name of user |
| `email`      | `string` | **Required**. Email of user |
| `password`      | `string` | **Required**. Password of user |

#### User Sign-in

```http
  POST /api/auth/signin
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email`      | `string` | **Required**. Email of user |
| `password`      | `string` | **Required**. Password of user |

#### Payer Sign-up

```http
  POST /api/payer/signup
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `name`      | `string` | **Required**. Name of payer |
| `email`      | `string` | **Required**. Email of payer |
| `password`      | `string` | **Required**. Password of payer |
| `address`      | `string` | **Required**. Address of payer |
| `phone`      | `string` | **Required**. Phone number of payer |

#### Payer Sign-in

```http
  POST /api/payer/signin
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email`      | `string` | **Required**. Email of payer |
| `password`      | `string` | **Required**. Password of payer |

#### Create Insurance (Payer)

```http
  POST /api/insurance
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `name`      | `string` | **Required**. Name of Insurance |
| `policy_number`      | `string` | **Required**. Policy number of insurance |
| `coverage_details`      | `string` | **Required**. Coverage Details of insurance |
| `maximum_amount`      | `number` | **Required**. Maximum amount of insurance |

#### Get All Insurances

```http
  Get /api/insurance
```

#### Get Insurance by ID

```http
  Get /api/insurance/:insuranceId
```

#### Claim Insurance (User)

```http
  POST /api/claim
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `procedure_code`      | `string` | **Required**. Policy number of Insurance |
| `amount`      | `number` | **Required**. Amount less than equal to the maximum_amount of insurance |

#### Get All claims

```http
  Get /api/claim
```

#### Get Claim by ID

```http
  Get /api/claim/:id
```

#### Get Claim status by ID

```http
  Get /api/claim/status/:id
```

#### Update Claim status (Payer)

```http
  PATCH /api/claim/:claimId
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `status`      | `string` | **Required**. Updated status of claim |
    
## Docker Support
    
This project includes a Dockerfile for containerization.
    
To build and run the container:
```bash
docker build -t my-node-app 
docker run -p 3000:5000 my-node-app
```

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