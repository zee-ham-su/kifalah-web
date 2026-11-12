import { Router, type IRouter } from "express";
import healthRouter from "./health";
import programmesRouter from "./programmes";
import newsRouter from "./news";
import impactRouter from "./impact";
import contactRouter from "./contact";
import volunteersRouter from "./volunteers";
import partnershipsRouter from "./partnerships";
import newsletterRouter from "./newsletter";
import donationsRouter from "./donations";
import documentsRouter from "./documents";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(programmesRouter);
router.use(newsRouter);
router.use(impactRouter);
router.use(contactRouter);
router.use(volunteersRouter);
router.use(partnershipsRouter);
router.use(newsletterRouter);
router.use(donationsRouter);
router.use(documentsRouter);
router.use(adminRouter);

export default router;
