import { repository } from "./repository.js";

await repository.initialize();
console.log("Seed complete: services and admin user are ready.");
