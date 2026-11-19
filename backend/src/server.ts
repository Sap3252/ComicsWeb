import express, { type Request, type Response } from 'express';
import "dotenv/config";
import { toNodeHandler } from "better-auth/node";
import { connectDB } from "./config/db.js";
import { auth } from "./config/auth.js";
import { comicsRouter } from "./routes/comics.js";
import { errorHandler } from "./middlewares/error-handler.js";


const app = express();
const PORT = process.env.PORT || 3000;
type Environment = "development" | "production" | "test";
const NODE_ENV: Environment = (process.env.NODE_ENV as Environment) ?? "development";

// Antes de express.json(): Better Auth parsea su propio body
app.all('/api/auth/*splat', toNodeHandler(auth));
app.use(express.json());

if (NODE_ENV === "development") {
  app.get('/', (req: Request, res: Response) => {
    res.send('Servidor Activo');
  });
}
app.use('/api/comics', comicsRouter);
// Después de las rutas: recibe los errores que lanzan
app.use(errorHandler);

await connectDB();                        

app.listen(PORT, () => {
  console.log(`Server funcionando en el puerto ${PORT}`);
});
