import { router } from "../_core/trpc";
import { systemRouter } from "../_core/systemRouter";
import { authRouter } from "./auth";
import { federationsRouter } from "./federations";
import { clubsRouter } from "./clubs";
import { eventsRouter } from "./events";
import { athletesRouter } from "./athletes";
import { coachesRouter } from "./coaches";
import { venuesRouter } from "./venues";
import { newsRouter } from "./news";
import { streamsRouter } from "./streams";

export const appRouter = router({
  system: systemRouter,
  auth: authRouter,
  federations: federationsRouter,
  clubs: clubsRouter,
  events: eventsRouter,
  athletes: athletesRouter,
  coaches: coachesRouter,
  venues: venuesRouter,
  news: newsRouter,
  streams: streamsRouter,
});

export type AppRouter = typeof appRouter;
