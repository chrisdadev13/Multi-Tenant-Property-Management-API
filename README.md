## Description

Backend API for a multi-tenant property management system using NestJS. The system should support tenant isolation, role-based access control (RBAC), and advanced aggregation-based queries.

## Project setup

Start the database

```bash
$ docker-compose up
```

## Seed the database

```bash
$ npx nestjs-command db:seed
```

## Compile and run the project

```bash
# watch mode
$ npm run start:dev
```

[Postman Collection](https://www.postman.com/chrisdadev13/my-workspace)

## Login as Admin
```bash
Email: admin@example.com
Password: admin123
```

## Login as Property Manager
```bash
Email: tenant@example.com
Password: manager123
```     

## Login as User
```bash
Email: tenant@example.com
Password: tenant123
```

## Database

![Untitled(1)](https://github.com/user-attachments/assets/ec10bc5b-bb96-4a3f-8514-c6d868543f25)
