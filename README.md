# Log-Engine

**Log-Engine** is a robust solution for logging and centralizing logs from multiple applications in a user-selected database. It can be deployed as a self-hosted service or used via our hosted **Log-Engine Cloud** platform, providing a fully managed cloud-based log solution. The solution includes a user-friendly UI for searching, filtering logs, and managing access with role-based permissions and group management.

## Features

- **Centralized Logging**: Aggregate and centralize logs from multiple applications into one database.
- **Database Flexibility**: Supports a wide range of databases (PostgreSQL, MySQL, MongoDB, etc.) that can be selected by the user.
- **Self-hosted or Cloud**: Choose between self-hosting Log-Engine or using the fully managed **Log-Engine Cloud** service hosted at [log-engine.io](https://logengine.io).
- **REST API**: Interact with logs via a RESTful API (create, delete, search).
- **UI Application**: A built-in UI to search, filter logs by application or severity, and manage logs.
- **Access Control**: Role-based access control (RBAC) to manage who can access or manage logs.
- **Group Management**: Organize users into groups to simplify access permissions.
- **Multi-Application Support**: Logs from multiple applications can be tracked and managed in a single place.
- **Real-time Monitoring**: Provides real-time log monitoring across different applications.

## Requirements

For self-hosted setups:
- Docker
- Docker compose

## Installation (Self-hosted)

### 1. Clone the Repository

```bash
git clone https://github.com/log-engine/logengine.git
cd log-engine
```

### 2. Run the docker-compose up command.

```bash
docker compose up
```

Access the ui [http://localhost:3000](http://localhost:3000).

## Log-Engine Cloud

### What is Log-Engine Cloud?

Log-Engine Cloud is a fully managed, hosted version of the Log-Engine platform available at [log-engine.io](https://log-engine.io). You can register for an account, connect your applications, and start managing logs without the need to set up or maintain any infrastructure.

### Benefits of Log-Engine Cloud

- **No infrastructure management**: We handle all hosting, database management, and scaling.
- **Secure and scalable**: Our platform is built with enterprise-grade security and scalability.
- **Access from anywhere**: Centralized logging in the cloud, accessible from any device.
- **Fully managed**: No need to worry about upgrades or maintenance.
- **24/7 Support**: Get round-the-clock assistance from our support team.

### Getting Started with Log-Engine Cloud

1. Visit [log-engine.io](https://logengine.io) and sign up for an account.
2. Add your applications and configure them to send logs to Log-Engine Cloud.
3. Start viewing, searching, and managing your logs via our intuitive web-based dashboard.

### UI Application

Whether self-hosted or using Log-Engine Cloud, you can access a web-based UI to manage logs:

- **Search and Filter**: Use the UI to search logs by application, severity, or time range.
- **Access Control**: Assign roles (Admin, Developer, Viewer) to restrict or allow access to certain logs.
- **Group Management**: Manage users in groups to define their permissions across applications.
- **Real-time Monitoring**: Watch live logs coming in from your applications for faster debugging and tracking.

### Supported Databases

- PostgreSQL
- MySQL
- MongoDB
- SQLite (optional for testing or small-scale projects)

## Contribution

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a branch (`feature/new-feature`).
3. Commit your changes.
4. Open a Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more details.

