import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign ,decode ,verify  } from "hono/jwt";
import zod from 'zod'
import { signupInput ,signinInput} from "medium-blog-axyan";





export const userRouter =  new Hono<{
    Bindings:{
        DATABASE_URL : string,
        SECRET :string
    }
}>()

userRouter.post('/signup', async(c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())
  
    const body = await c.req.json();

    //input validation
    const {success} =  signupInput.safeParse(body);
    if(!success)
    {
      c.status(411);
      return c.json({
        message:"Inavlid input!!"
      })
    }
  
    try {
  
      // const hashedPass = await bcrypt.hash(body.password , 10);
      const user =  await prisma.user.create({
        data:{
          name:body.name,
          email:body.email,
          password:body.password
        }
      })
       
      const token =  await sign({id:user.id} , c.env.SECRET)
      return c.json({
        message:"User created successfully",
        token:token
      })
      
    } catch (error) {
      //for duplicate values 
      return c.text("Invalid credentials")
    }
    return c.text("lavda")
  })
  
userRouter.post('/signin', async(c) => {
    const prisma = new PrismaClient({
      datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate());
  
  
    const body = await c.req.json();

    const {success} = signinInput.safeParse(body)
    if(!success)
    {
      c.status(411);
      return c.json({
        message:"Inavlid inputs"
      })
    }
  
    try {
      
      const user  = await prisma.user.findFirst({
        where:{
          email :body.email,
          password: body.password
        }
      })
  
  
      //not found
      if(!user)
      {
        c.status(403)
        return c.text("Invalid Credentials")
      }else{
        const token = await sign({id:user.id},c.env.SECRET)
  
        return c.json({
          message:`Signed In`,
          token : token
        })
      }
    } catch (error) {
      return c.text(`Error :-  ${error}`)
    }
  })  
  