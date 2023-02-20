import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getTodosForUser } from '../../businessLogic/todos'
import { parseUserId } from '../../auth/utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const authorization = event.headers.Authorization
    const split = authorization.split(' ')
    const jwtToken = split[1]
    const userId = parseUserId(jwtToken)
    const todos = await getTodosForUser(userId)

    return {
      statusCode: 200,
      body: JSON.stringify({
        todos
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
