import mongoose from 'mongoose'

declare global {
  var _mongooseConn: typeof mongoose | null
  var _mongoosePromise: Promise<typeof mongoose> | null
}

export async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI
  if (!MONGODB_URI) throw new Error('MONGODB_URI is not defined')

  if (global._mongooseConn) return global._mongooseConn

  if (!global._mongoosePromise) {
    global._mongoosePromise = mongoose.connect(MONGODB_URI)
  }

  global._mongooseConn = await global._mongoosePromise
  return global._mongooseConn
}
