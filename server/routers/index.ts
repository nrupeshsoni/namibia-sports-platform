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
import { schoolsRouter } from "./schools";
import { mediaRouter } from "./media";
import { hpProgramsRouter } from "./hpPrograms";
import { uploadRouter } from "./upload";
import { whatsappRouter } from "./whatsapp";
import { aiRouter } from "./ai";
import { searchRouter } from "./search";

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
  schools: schoolsRouter,
  media: mediaRouter,
  hpPrograms: hpProgramsRouter,
  upload: uploadRouter,
  whatsapp: whatsappRouter,
  ai: aiRouter,
  search: searchRouter,
});

export type AppRouter = typeof appRouter;
