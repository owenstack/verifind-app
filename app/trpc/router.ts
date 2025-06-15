import { mailerRouter } from "./routes/mailer";
import { publicRouter } from "./routes/public";
import { createTRPCRouter } from "./utils";

export const appRouter = createTRPCRouter({
	public: publicRouter,
	mailer: mailerRouter,
});

export type AppRouter = typeof appRouter;
