import { Sink } from "./sinks";
import { EventTrace, EventMark } from "./types";

export interface TracerConfig {
  timeFn?: () => number;
  pidFn?: () => number;
  tidFn?: () => number;
}

const DEFAULT_CONFIG: TracerConfig = {
  timeFn: () => Date.now() * 1000,
  pidFn: () => process.pid,
  tidFn: () => 1,
};

export class Tracer {
  sinks: Sink[] = [];
  config: TracerConfig;

  constructor(config: TracerConfig, sinks = []) {
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
    };

    this.sinks.push(...sinks);
  }

  async _record(ev: EventTrace) {
    if (!ev.ts) ev.ts = this.config.timeFn!();
    if (!ev.pid) ev.pid = this.config.pidFn!();
    if (!ev.tid) ev.tid = this.config.tidFn!();

    await Promise.all(this.sinks.map((sink) => sink.record(ev)));
  }

  async span<T>(name: string, fn: () => Promise<T>): Promise<T> {
    // TODO(PV): Log beginning of event.
    const result = await fn();
    // TODO(PV): Log end of event.
    return result;
  }

  async mark(name: string) {
    const ev: EventMark = {
      ph: "R",
      name,
    };

    await this._record(ev);
  }

  /**
   * Emit a raw event, for customized logging.
   *
   * @param ev Raw event that will be emitted.
   */
  async emit(ev: EventTrace) {
    await this._record(ev);
  }
}
