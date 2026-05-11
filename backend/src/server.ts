import { app } from "./app.js";
import { repository } from "./db/repository.js";
import { env } from "./utils/env.js";

await repository.initialize();

app.listen(env.port, () => {
  console.log(`Water services API running on http://localhost:${env.port}`);
});
