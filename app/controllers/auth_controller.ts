import type { HttpContext } from '@adonisjs/core/http'
import { loginValidator, registerValidator } from '#validators/auth'
import User from '#models/user'

export default class AuthController {
  public async register({ request, auth, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(registerValidator)
      const user = await User.create({
        ...payload,
        role: payload.role as 'admin' | 'user',
      })
      const token = await auth.use('api').createToken(user)

      return response.status(201).json({
        status: 'success',
        message: 'User registered successfully',
        data: {
          user,
          token,
        },
      })
    } catch (error) {
      return response.status(400).json({
        status: 'error',
        message: (error as any)?.messages ?? (error as any)?.message ?? 'Failed to register user',
      })
    }
  }

  public async login({ request, auth, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(loginValidator)
      const { email, password } = payload
      const user = await User.verifyCredentials(email, password)
      const token = await auth.use('api').createToken(user)
      return response.status(200).json({
        status: 'success',
        message: 'User logged in successfully',
        data: {
          user,
          token,
        },
      })
    } catch (error) {
      return response.status(400).json({
        status: 'error',
        message: 'Invalid credentials',
      })
    }
  }
}
