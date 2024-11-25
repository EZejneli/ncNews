# ncNews

An API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as Reddit) which should provide this information to the front end architecture.
---

## Getting Started

### Prerequisites

Before running this project, ensure you have the following installed:

- Node.js
- PostgreSQL

### Installation

1. **Clone the repository**:
   ```bash
   git clone YOUR_REPO_URL_HERE
   cd YOUR_PROJECT_DIRECTORY

### Install dependencies:

npm install

### Set up the databases:

Create two .env files in the root of your project:

.env.development
.env.test

### Add the following to each file, replacing <DATABASE_NAME> with the appropriate name found in /db/setup.sql:

PGDATABASE=<DATABASE_NAME>

Ensure .env files are ignored by Git: The .env.* files are already included in the .gitignore file, so they will not be committed to the repository.

### Database Setup

## To create and seed the databases:

npm run setup-dbs


## Seed the development database:

npm run seed

### Running the Project

## To run the project in development mode:

npm run start

## To run tests:

npm test