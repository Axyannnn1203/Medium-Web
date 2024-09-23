import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode , sign , verify  } from 'hono/jwt'
import { userRouter } from './Routes/user'
import { blogRouter } from './Routes/blog'
// import bcrypt from 'bcrypt'



//as typescript dont wrangler.toml we have to define it explicitly
const app = new Hono<{
  Bindings:{
      DATABASE_URL : string,
      SECRET :string
  }
}>()


app.route('/api/v1/user' ,userRouter)
app.route('/api/v1/blog' ,blogRouter)



export default app
