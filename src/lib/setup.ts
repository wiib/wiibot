import * as dotenv from "dotenv";
import { join } from "node:path";
import { cwd } from "process";

// Config dotenv
dotenv.config({ path: join(cwd(), ".env") });