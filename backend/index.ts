import { Prisma } from "./generated/prisma";
import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import helmet from "helmet";
import { ZodError } from "zod";
import { ApiError } from "./lib/http";
import analyticsRouter from "./routes/analytics";
import checkoutRouter from "./routes/checkout";

const allowedOrigins = (process.env.CLIENT_URL ?? "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true
  })
);
app.use(express.json({ limit: "100kb" }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/checkout", checkoutRouter);
app.use("/api/analytics", analyticsRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof ZodError) {
    res.status(400).json({
      error: "Validation failed",
      issues: error.issues
    });
    return;
  }

  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      error: error.message,
      details: error.details
    });
    return;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2034") {
      res.status(409).json({
        error: "The checkout transaction conflicted with another request. Please retry."
      });
      return;
    }

    if (error.code === "P2002") {
      res.status(409).json({ error: "A unique constraint was violated" });
      return;
    }

    if (error.code === "P2025") {
      res.status(404).json({ error: "The requested record was not found" });
      return;
    }
  }

  console.error(error);
  res.status(500).json({ error: "Internal server error" });
});

const port = Number(process.env.PORT ?? 4001);

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});

export { app };
