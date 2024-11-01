import express from "express";
import cors from "cors";
import morgan from "morgan";
import userRoutes from "./routes/usersRoutes";
import panelProductRoutes from "./routes/panelProductsRoutes";
import productsRoutes from "./routes/publicProductsRoutes";
import orderRoutes from "./routes/orderRoutes";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use(userRoutes);
app.use(panelProductRoutes);
app.use(productsRoutes);
app.use(orderRoutes);

export default app;
