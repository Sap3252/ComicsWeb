import express, { type Request, type Response } from 'express';
import "dotenv/config";
import cors from 'cors';
import { connectDB } from "./config/db.js";
import { comicsRouter } from "./routes/comics.js";


const app = express();
const PORT = process.env.PORT || 3000;
type Environment = "development" | "production" | "test";
const NODE_ENV: Environment = (process.env.NODE_ENV as Environment) ?? "development";

app.use(cors({ origin: process.env.CORS_ORIGIN ?? "http://localhost:3000" }));
app.use(express.json());                 // <-- sin esto, req.body llega undefined

if (NODE_ENV === "development") {
  app.get('/', (req: Request, res: Response) => {
    res.send('hola');
  });
}
app.use('/api/comics', comicsRouter);

await connectDB();                        

app.listen(PORT, () => {
  console.log(`Server funcionando en el puerto ${PORT}`);
});
