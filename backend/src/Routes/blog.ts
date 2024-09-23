import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign ,decode ,verify  } from "hono/jwt";
import { createBlogInput , updateBlogInput } from "medium-blog-axyan";

export const blogRouter = new Hono<{
    Bindings:{
        DATABASE_URL : string,
        SECRET :string
    },
    Variables:{
        userId:any
    }
}>()


//here /* means anywhere in the route associated with blogRouter
blogRouter.use("/*", async(c,next)=>{
    const authHeader  = c.req.header("authorization") || ""
    //verification
    const user = await verify(authHeader, c.env.SECRET);

    if(user)
    {
        c.set("userId", user.id)
        await next();
    }else{
        c.status(403)
        return c.json({
            message: " You are not logged in "
        })
    }
    
})

blogRouter.post('/', async(c)=>{

    const prisma = new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate());

    //get body
     const body = await c.req.json();

     //validations
     const {success} = createBlogInput.safeParse(body);
     if(!success)
     {
        c.status(403)
        return c.json({
            message:"Invalid creds"
        })
     }

     const userId = c.get("userId")
    const blog = await prisma.blog.create({
        data:{
            title : body.title,
            content:body.content,
            authorId : Number(userId)
        }
    })


    return c.json({
        id: blog.id
    })
})



blogRouter.put('/',async(c)=>{
    const prisma = new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate());

    //get body
     const body = await c.req.json();

     //validations
     const {success} = updateBlogInput.safeParse(body)
     if(!success)
     {
        c.status(411)
        return c.json({
            message:"Invalid creds"
        })
     }

    const blog = await prisma.blog.update({
        where:{
            id:body.id
        },
        data:{
            title : body.title,
            content:body.content,
        }
    })

    return c.json({
        id: blog.id,
        message:`Blog updated successfully`
    })
})



//Add pagintation ,Ex. bring the blog in number 0f 10 per page
blogRouter.get('/bulk', async(c)=>{
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());

    try {

        const blogs  = await prisma.blog.findMany({});
        return c.json({
            blogs
        })        
    } catch (error) {
        c.status(403)
        return c.json({
            message :`Unable to fetch Blogs ${error}`
        })
    }

})



blogRouter.get('/:id',async(c)=>{
    const prisma = new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate());

    //get body
     const body = await c.req.json();

    const id = await c.req.param("id");

    try {
        const blog = await prisma.blog.findFirst({
            where:{
                id: Number(id)
            }
        })
    
        return c.json({
           blog
        })
    } catch (error) {
        c.status(403)
        return c.text(`Error :- ${error}`)
    }
})



