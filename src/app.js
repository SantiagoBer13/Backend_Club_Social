import Express from "express"
import newRoutes from "./routes/news.routes.js"

const app = Express()

app.use(Express.json())
app.use("/api",newRoutes)
app.use((req,res,next)=>{
    res.status(404).json({
        message: "Endpoint not found"
    })
})

export default app