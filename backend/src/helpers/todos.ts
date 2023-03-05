import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from './todosAcess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { DeleteTodoRequest } from '../requests/DeleteTodoRequest'
import { getAttachmentUrl, getUploadUrl } from './attachmentUtils'
import { createLogger } from '../utils/logger'

const todoAccess = new TodoAccess()
const logger = createLogger('S3')

export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
  return todoAccess.getTodosForUser(userId)
}

export async function deleteTodo(
  deleteData: DeleteTodoRequest
): Promise<boolean> {
  return todoAccess.deleteTodo(deleteData)
}

export async function updateTodo(
  updateTodoRequest: UpdateTodoRequest,
  todoId: string,
  userId: string
): Promise<boolean> {
  return todoAccess.updateTodo({ ...updateTodoRequest, todoId, userId })
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {
  const todoId = uuid.v4()

  const result = await todoAccess.createTodo({
    todoId,
    userId: userId,
    name: createTodoRequest.name,
    done: false,
    dueDate: createTodoRequest.dueDate,
    createdAt: new Date().toISOString()
  })
  return result
}

export async function createAttachmentPresignedUrl(
  todoId: string,
  userId: string
): Promise<string | null> {
  try {
    const attachmentId = uuid.v4()
    const uploadUrl = getUploadUrl(attachmentId)
    const attachmentUrl = getAttachmentUrl(attachmentId)
    logger.info('Presigned url is' + uploadUrl)
    logger.info('Formatted url is' + attachmentUrl)
    const saveDbCall = await todoAccess.updateAttachmentUrl(
      todoId,
      userId,
      attachmentUrl
    )
    logger.info('Save db called', { saveDbCall })
    return uploadUrl
  } catch (e) {
    logger.info('Cannot upload/save attachment', e)
    return null
  }
}
