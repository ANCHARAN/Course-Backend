Certainly! Below is the Markdown code for each step mentioned in the guide. You can copy each section into your `.md` file as needed.

# Project Setup Guide

## Table of Contents
1. [Creating a MongoDB Instance](#creating-a-mongodb-instance)
2. [Setting Up Environment Variables](#setting-up-environment-variables)
3. [Initializing Prisma Client](#initializing-prisma-client)
4. [Using Prisma Studio](#using-prisma-studio)
5. [Creating a Google Cloud Storage Bucket](#creating-a-google-cloud-storage-bucket)
6. [Viewing Routes](#viewing-routes)
7. [Service Account Credentials](#service-account-credentials)
8. [Conclusion](#conclusion)

## Creating a MongoDB Instance

1. **Sign Up / Log In to MongoDB Atlas**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create an account or log in.

2. **Create a New Project**
   - Click on the "Projects" tab and create a new project.

3. **Create a Cluster**
   - In your project, click on "Build a Cluster".
   - Choose the Free Tier and select a cloud provider and region.
   - Click "Create Cluster" and wait for it to be provisioned.

4. **Create a Database User**
   - Go to the "Database Access" tab.
   - Click on "Add New Database User".
   - Create a user with a username and password, and assign them appropriate roles.

5. **Network Access**
   - Go to the "Network Access" tab.
   - Click "Add IP Address" and allow access from your current IP or allow access from anywhere.

6. **Connect to Your Cluster**
   - Click on "Connect" and choose "Connect your application".
   - Copy the connection string provided (it will look like `mongodb+srv://<username>:<password>@<cluster-address>/test?retryWrites=true&w=majority`).

## Setting Up Environment Variables

1. **Create a `.env` File**
   - In your project root, create a file named `.env`.
   - Add the following content, replacing the placeholders with your MongoDB credentials:

   ```env
   DATABASE_URL="mongodb+srv://<username>:<password>@<cluster-address>/test?retryWrites=true&w=majority"

## Initializing Prisma Client

1. **Install Prisma and MongoDB Driver**
   ```bash
   npm install @prisma/client prisma
   ```

2. **Initialize Prisma**
   ```bash
   npx prisma init
   ```

3. **Configure `schema.prisma`**
   - Open the `prisma/schema.prisma` file.
   - Update the `datasource` block to use MongoDB:

   ```prisma
   datasource db {
     provider = "mongodb"
     url      = env("DATABASE_URL")
   }

   generator client {
     provider = "prisma-client-js"
   }
   ```

4. **Create Prisma Models**
   - Define your models inside the `schema.prisma` file as needed.

5. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

## Using Prisma Studio

1. **Start Prisma Studio**
   ```bash
   npx prisma studio
   ```

2. **Interact with Your Database**
   - This will open Prisma Studio in your browser, where you can view and manipulate your data.

## Creating a Google Cloud Storage Bucket

1. **Sign Up / Log In to Google Cloud**
   - Go to [Google Cloud Console](https://console.cloud.google.com/) and create an account or log in.

2. **Create a New Project**
   - Click on the project dropdown in the top-left corner and select "New Project".

3. **Enable Google Cloud Storage API**
   - Navigate to "APIs & Services" > "Library".
   - Search for "Google Cloud Storage" and enable it.

4. **Create a Storage Bucket**
   - Go to "Cloud Storage" > "Buckets".
   - Click on "Create Bucket".
   - Choose a unique name, select a location, and set your access controls.
   - Click "Create".

5. **Set Up Service Account for Access**
   - Go to "IAM & Admin" > "Service Accounts".
   - Click "Create Service Account" and provide a name and description.
   - Grant it the role `Storage Admin`.
   - Click "Done" and then create a key in JSON format.

## Viewing Routes

1. **Define Routes in Your Project**
   - Ensure that you have routes set up in your Express application (e.g., `/upload` and `/view-videos`).

2. **Access Routes in Your Browser**
   - Start your server:

   ```bash
   node server.js
   ```

   - Visit the following routes:
     - **Upload Video:** `http://localhost:3000/`
     - **View Videos:** `http://localhost:3000/view-videos`

## Service Account Credentials

1. **Store Your Service Account Key**
   - Keep the downloaded JSON file with your service account key safe and do not expose it publicly.

2. **Use in Your Application**
   - Reference this key file in your application where required to authenticate with Google Cloud services.

## Conclusion

You have successfully set up a MongoDB instance, configured Prisma, created a Google Cloud Storage bucket, and defined routes for your project. This guide should help you manage your database and storage effectively. If you have any questions or need further assistance, feel free to reach out!
```

### Saving the Markdown File

1. Copy the content above into a text editor.
2. Save the file with the name `PROJECT_GUIDE.md`.

This detailed Markdown structure allows you to document each step of your project setup clearly and systematically. Let me know if you need any further assistance!
