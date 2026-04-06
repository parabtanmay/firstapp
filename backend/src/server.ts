import { app } from "./app.js";
import { env } from "./config/env.js";
import { initCosmos } from "./services/cosmosService.js";
import { ensureContainers } from "./services/storageService.js";

const bootstrap = async () => {
  await Promise.all([initCosmos(), ensureContainers()]);
  app.listen(env.PORT, () => {
    console.log(`Backend listening on http://localhost:${env.PORT}`);
  });
};

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
