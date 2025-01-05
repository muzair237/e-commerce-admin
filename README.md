# E-Commerce Admin Frontend

This repository contains the frontend code for the **Admin Panel** of my E-commerce project. The frontend is built using **Next.js 14** with **Redux Toolkit** for state management, and it uses the **Velzon** template for the UI, which is styled with **SASS**.

### ⚠️ **In Progress**

This project is still in progress and is not yet completed. I plan to scale it further in the future.

## Technologies

1. **Next.js** (Frontend framework)
2. **Redux Toolkit** (State management)
3. **SASS** (Styling)
4. **Velzon** (Admin UI Template)

## Features

This admin frontend currently includes the following key features:

- **Admin Dashboard**: Overview of key stats, activity, and quick links to important sections.
- **Product Management**: Manage products, including adding, editing, and deleting products and its variants.
- **Brand Management**: CRUD operations for managing brands.
- **Role and Permissions Management**: Allows the management of user roles and permissions within the admin panel.
- **User Management**: Manage admin users and their roles.

These features have been implemented with scalability and maintainability in mind. The system is designed to be **100% scalable**, with the ability to grow over time.

## Code Organization

The code follows a modular structure, making it easy to scale and maintain. The main sections of the code are divided into:

- **Components**: Reusable UI components such as buttons, forms, and tables.
- **Pages**: Pages for the different admin functionalities like the dashboard, product management, and admin management.
- **Redux Store**: State management using Redux Toolkit, with slices for managing global state and API calls.
- **Styles**: SASS styles used for custom UI and styling, including the use of the Velzon template styles.

## Role-Based Access Control

A complete **Role-Based Access Control (RBAC)** mechanism is implemented to manage user roles and their permissions. This system restricts access to certain parts of the application based on the user's role.

## Future Plans

This project is built with a vision to scale gradually, adding more features and improvements as required.

## Installation

1. Clone this repository.

```bash
git clone https://github.com/muzair237/e-commerce-admin.git
```

2. Install dependencies.

```bash
npm install
```

3. Create a .env-cmdrc.json file in the root directory and paste the following content as shown below.

```bash
{
    "development": {
        "NODE_ENV": "development",
        "PORT": "3002",
        "NEXT_PUBLIC_AUTH_API_URL": "http://localhost:4008/api/auth",
        "NEXT_PUBLIC_BRANDS_API_URL": "http://localhost:4008/api/brands",
        "NEXT_PUBLIC_PRODUCTS_API_URL": "http://localhost:4008/api/products",
        "NEXT_PUBLIC_PERMISSIONS_API_URL": "http://localhost:4008/api/permissions",
        "NEXT_PUBLIC_ROLES_API_URL": "http://localhost:4008/api/roles",
        "NEXT_PUBLIC_ADMINS_API_URL": "http://localhost:4008/api/admins",
        "NEXT_PUBLIC_ADMIN_TOKEN_COOKIE": "_aivatc",
        "NEXT_PUBLIC_ADMIN_ALLOWED_PAGES_COOKIE": "_aivap"
    },
    "production": {}
}
```

4. Run the application.

```bash
npm run dev
```

Thank you for checking out the project.
