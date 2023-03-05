import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
const logger = createLogger('APIs')

const XAWS = AWSXRay.captureAWS(AWS)

import { TodoItem } from '../models/TodoItem'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { DeleteTodoRequest } from '../requests/DeleteTodoRequest'

export class TodoAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todoTable = process.env.TODOS_TABLE,
    private readonly createdIndex = process.env.TODOS_CREATED_AT_INDEX
  ) {}

  async getTodo(todoId: string): Promise<TodoItem> {
    logger.info('Getting todo with id', todoId)

    const result = await this.docClient
      .query({
        TableName: this.todoTable,
        IndexName: this.createdIndex,
        KeyConditionExpression: 'todoId = :todoId',
        ExpressionAttributeValues: {
          ':todoId': todoId
        }
      })
      .promise()

    const item = result.Items[0]
    //@ts-ignore
    return item
  }

  async getTodosForUser(userId: string): Promise<TodoItem[]> {
    logger.info('Getting users todos', { userId })

    const result = await this.docClient
      .query({
        TableName: this.todoTable,
        IndexName: this.createdIndex,
        KeyConditionExpression: 'userId = :val',
        ExpressionAttributeValues: {
          ':val': userId
        }
      })
      .promise()
    logger.info('Dynamodb result', result)
    const items = result.Items
    return items as TodoItem[]
  }

  async createTodo(todo: TodoItem): Promise<TodoItem> {
    logger.info('Create todo', todo)
    await this.docClient
      .put({
        TableName: this.todoTable,
        Item: todo
      })
      .promise()

    return todo
  }

  async updateTodo(todo: UpdateTodoRequest): Promise<boolean> {
    logger.info('Update todo', todo)
    const result = await this.docClient
      .update({
        TableName: this.todoTable,
        Key: {
          userId: todo.userId,
          todoId: todo.todoId
        },
        UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
        ExpressionAttributeNames: {
          '#name': 'name'
        },
        ExpressionAttributeValues: {
          ':name': todo.name,
          ':dueDate': todo.dueDate,
          ':done': todo.done
        }
      })
      .promise()
    logger.info('Update response from dynamodb', result)
    return true
  }

  async deleteTodo(deleteTodo: DeleteTodoRequest): Promise<boolean> {
    logger.info('Delete todo with details', deleteTodo)
    await this.docClient
      .delete({
        TableName: this.todoTable,
        Key: {
          userId: deleteTodo.userId,
          todoId: deleteTodo.todoId
        }
      })
      .promise()

    return true
  }

  async updateAttachmentUrl(
    todoId: string,
    userId: string,
    attachmentUrl: string
  ): Promise<void> {
    await this.docClient
      .update({
        TableName: this.todoTable,
        Key: {
          userId: userId,
          todoId: todoId
        },
        UpdateExpression: 'set attachmentUrl = :attachmentUrl',
        ExpressionAttributeValues: {
          ':attachmentUrl': attachmentUrl
        }
      })
      .promise()
    logger.info(`Attachment for todo${todoId} updated successfully`)
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
