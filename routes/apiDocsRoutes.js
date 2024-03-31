import express from "express";

import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json" assert { type: "json" };

const apiDocsRoutes = express.Router();

apiDocsRoutes.use("/api-docs", swaggerUi.serve);
apiDocsRoutes.get("/api-docs", swaggerUi.setup(swaggerDocument));

export default apiDocsRoutes;
