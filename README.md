# Project name

Infogram - A Serverless todo/data organizer Application

# Functionality of the application

This application allows creating/removing/updating/fetching TODO/DATA items. Each TODO/DATA item can optionally have an attachment image. Each user only has access to TODO/DATA items that he/she has created.

# Architecture Diagram

![Alt text](/architecture.png?raw=true 'Architecture')

# Functions implemented

- `Auth` - this function implements a custom authorizer for API Gateway that will be added to all other functions.

- `GetTodos` - Will return all TODO/DATAs for a current user. A user id can be extracted from a JWT token that is sent by the frontend

It returns data that looks like this:

```json
{
  "items": [
    {
      "todoId": "123",
      "createdAt": "2019-07-27T20:01:45.424Z",
      "name": "MIT",
      "dueDate": "2019-07-29T20:01:45.424Z",
      "done": false,
      "attachmentUrl": "http://example.com/image.png"
    },
    {
      "todoId": "456",
      "createdAt": "2019-07-27T20:01:45.424Z",
      "name": "Harvard",
      "dueDate": "2019-07-29T20:01:45.424Z",
      "done": true,
      "attachmentUrl": "http://example.com/image.png"
    }
  ]
}
```

- `CreateTodo` - Creates a new TODO/DATA for a current user.

It receives a new TODO/DATA item to be created in JSON format that looks like this:

```json
{
  "createdAt": "2019-07-27T20:01:45.424Z",
  "name": "Buy milk",
  "dueDate": "2019-07-29T20:01:45.424Z",
  "done": false,
  "attachmentUrl": "http://example.com/image.png"
}
```

It returns a new TODO/DATA item that looks like this:

```json
{
  "item": {
    "todoId": "123",
    "createdAt": "2019-07-27T20:01:45.424Z",
    "name": "Buy milk",
    "dueDate": "2019-07-29T20:01:45.424Z",
    "done": false,
    "attachmentUrl": "http://example.com/image.png"
  }
}
```

- `UpdateTodo` - Updates a TODO/DATA item created by a current user.

It receives an object that contains three fields that can be updated in a TODO/DATA item:

```json
{
  "name": "Buy bread",
  "dueDate": "2019-07-29T20:01:45.424Z",
  "done": true
}
```

The id of an item that should be updated is passed as a URL parameter.

It returns an empty body.

- `DeleteTodo` - Deletes a TODO/DATA item created by a current user. Expects an id of a TODO/DATA item to remove.

It returns an empty body.

- `GenerateUploadUrl` - Returns a pre-signed URL that can be used to upload an attachment file for a TODO/DATA item.

It returns a JSON object that looks like this:

```json
{
  "uploadUrl": "https://s3-bucket-name.s3.eu-west-2.amazonaws.com/image.png"
}
```

All functions are already connected to appropriate events from API Gateway.

Necessary resources such as DynamoDB table and S3 bucket are used in this application.

# Frontend

The `client` folder contains a web application built on react that uses the serverless API developed in the project.

## Authentication

To implement authentication in this application, asymmetrically encrypted JWT tokens are used.

## Logging

[Winston](https://github.com/winstonjs/winston) logger is used to create [JSON formatted](https://stackify.com/what-is-structured-logging-and-why-developers-need-it/) log statements.
