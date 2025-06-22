import { mailerRouter } from "./routes/mailer";
import { propertyRouter } from "./routes/property";
import { publicRouter } from "./routes/public";
import { createTRPCRouter } from "./utils";

export const appRouter = createTRPCRouter({
	public: publicRouter,
	mailer: mailerRouter,
	property: propertyRouter,
});

export type AppRouter = typeof appRouter;
