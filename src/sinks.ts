import fsSync from "fs";
import fs from "fs/promises";
import { EventMark, EventTrace } from "./types";

/**
 * Generic interface for a trace sink.
 * This represents a consumer of a trace events.
 */
export interface Sink {
  /**
   * Consume a single trace event.
   * @param e the trace event
   */
  record(e: EventTrace): Promise<void>;

  /**
   * Complete the usage of this sink.
   * After this method is called, the sink should throw an error if reused.
   */
  shutdown(): Promise<void>;
}

/**
 * Sink that outputs to the console directly.
 * This will be visible over stdout.
 */
export class ConsoleSink implements Sink {
  isActive = true;

  constructor() {}

  async record(e: EventTrace) {
    if (!this.isActive)
      throw new Error("ConsoleSink was called after shutdown.");

    console.dir(e);
  }

  async shutdown() {
    this.isActive = false;
  }
}

/**
 * Sink that outputs a JSONArray to a file.
 * The file is appended in realtime as event records are dispatched.
 */
export class ArrayFileSink implements Sink {
  constructor(readonly path: string) {
    const mark: EventMark = {
      ph: "R",
      name: "startup",
    };

    fsSync.writeFileSync(path, "[\n" + JSON.stringify(mark));
  }

  async record(e: EventTrace) {
    await fs.appendFile(this.path, ",\n" + JSON.stringify(e));
  }

  async shutdown() {
    await fs.appendFile(this.path, "\n]\n");
  }
}
