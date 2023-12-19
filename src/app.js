import Express from "express";
import cors from "cors";
import newRoutes from "./routes/news.routes.js";
import eventRoutes from "./routes/events.routes.js"

const app = Express();

app.use(Express.json());
app.use(cors()); // Utiliza el middleware cors aquí

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
});

app.use("/api", newRoutes);
app.use("/api", eventRoutes);

app.use((req, res, next) => {
    res.status(404).json({
        message: "Endpoint not found"
    });
});

export default app;
