// See: https://docs.google.com/document/d/1CvAClvFfyA5R-PhYUmn5OOQtYMH4h6I0nSsKchNAySU/edit

interface EventBase {
  /**
   * The name of the event, as displayed in Trace Viewer
   */
  name?: string;

  /**
   * The event categories.
   * This is a comma separated list of categories for the event. The categories
   * can be used to hide events in the Trace Viewer UI.
   */
  cat?: string;

  /**
   * The event type.
   * This is a single character which changes depending on the type of event
   * being output. The valid values are listed in the table below.
   */
  ph: EventType;

  /**
   * The tracing clock timestamp of the event.
   * The timestamps are provided at microsecond granularity.
   */
  ts?: number;

  /**
   * The thread clock timestamp of the event.
   * The timestamps are provided at microsecond granularity.
   */
  tts?: number;

  /**
   * The process ID for the process that output this event.
   */
  pid?: number;

  /**
   * The thread ID for the thread that output this event.
   */
  tid?: number;

  /**
   * Any arguments provided for the event.
   * Some of the event types have required argument fields, otherwise, you can
   * put any information you wish in here. The arguments are displayed in Trace
   * Viewer when you view an event in the analysis section.
   */
  args?: { [key: string]: any };

  /**
   * A fixed color name to associate with the event.
   * If provided, cname must be one of the names listed in trace-viewer's base
   * color scheme's reserved color names list
   */
  cname?: string;
}

export type Event =
  | EventDuration
  | EventComplete
  | EventInstant
  | EventCounter
  | EventAsync
  | EventFlow
  | EventSample
  | EventObject
  | EventMetadata
  | EventMemoryDump
  | EventMark
  | EventClockSync
  | EventContext
  | EventLink;

export type EventType =
  | EventTypeDuration
  | EventTypeComplete
  | EventTypeInstant
  | EventTypeCounter
  | EventTypeAsync
  | EventTypeFlow
  | EventTypeSample
  | EventTypeObject
  | EventTypeMetadata
  | EventTypeMemoryDump
  | EventTypeMark
  | EventTypeClockSync
  | EventTypeContext
  | EventTypeLink;

export type EventTypeDuration = "B" | "E";
export type EventTypeComplete = "X";
export type EventTypeInstant = "i";
export type EventTypeCounter = "C";
export type EventTypeAsync = "b" | "n" | "e";
export type EventTypeFlow = "s" | "t" | "f";
export type EventTypeSample = "P";
export type EventTypeObject = "N" | "O" | "D";
export type EventTypeMetadata = "M";
export type EventTypeMemoryDump = "V" | "v";
export type EventTypeMark = "R";
export type EventTypeClockSync = "c";
export type EventTypeContext = "(" | ")";
export type EventTypeLink = "=";

interface EventDurationBase extends EventBase {
  ph: EventTypeDuration;
  ts: number;
  pid: number;
  tid: number;
}

type EventWithoutStackFrame = { sf?: never; stack?: never };
type EventWithStackFrame =
  | {
      /**
       * An id for a stackFrame object in the "stackFrames" map.
       */
      sf?: number;
      stack?: never;
    }
  | {
      /**
       * Raw stacks in the form of a stack array.
       *
       * A stack is just an array of strings. The 0th item in the array is the
       * rootmost part of the callstack, the last item is the leafmost entry in
       * the stack, e.g. the closest to what was running when the event was
       * issued. You can put anything you want in each trace, but strings in hex
       * form ("0x1234") are treated as program counter addresses and are eligible
       * for symbolization.
       */
      stack?: string[];
      sf?: never;
    };

export type EventDuration = EventDurationBase & EventWithStackFrame;

interface EventCompleteBase extends EventBase {
  ph: EventTypeComplete;
  ts: number;
  pid: number;
  tid: number;

  /**
   * The tracing clock duration of complete events in microseconds.
   */
  dur: number;
}

export type EventComplete = EventCompleteBase & EventWithStackFrame;

interface EventInstantBase extends EventBase {
  ph: EventTypeInstant;
  ts: number;
  pid: number;
  tid: number;

  /**
   * The scope of the event.
   * There are four scopes available global (g), process (p) and thread (t).
   */
  s: "g" | "p" | "t";
}

export type EventInstant = EventInstantBase &
  (
    | ({ s: "t" } & EventWithStackFrame)
    | ({ s: "g" | "p" } & EventWithoutStackFrame)
  );

export interface EventCounter extends EventBase {
  ph: EventTypeCounter;

  /**
   * When an id field exists, the combination of the event name and id is used
   * as the counter name.
   */
  id?: string;
}

export interface EventAsync extends EventBase {
  ph: EventTypeAsync;

  /**
   * Each async event has an additional required parameter id.
   * We consider the events with the same category and id as events from the
   * same event tree.
   */
  id: string;

  /**
   * An optional scope string can be specified to avoid id conflicts.
   * In this case we consider events with the same category, scope, and id as
   * events from the same event tree.
   */
  scope?: string;
}

interface EventFlowBase extends EventBase {
  ph: EventTypeFlow;
}

export type EventFlow = EventFlowBase &
  (
    | { ph: "s" | "t"; bp?: never }
    | {
        ph: "f";
        /**
         * If the event contains bp="e" then the binding point is "enclosing slice."
         */
        bp?: "e";
      }
  );

// (Deprecated)
interface EventSampleBase extends EventBase {
  ph: EventTypeSample;
}

export type EventSample = EventSampleBase & EventWithStackFrame;

export interface EventObjectBase extends EventBase {
  ph: EventTypeObject;

  /**
   * To identify an object, you need to give it an id, usually its pointer, e.g. id: "0x1000".
   */
  id: string;

  /**
   * An optional scope string can be specified to avoid id conflicts.
   * In this case we consider events with the same category, scope, and id as
   * events from the same event tree.
   */
  scope?: string;
}

export type EventObject = EventObjectBase &
  (
    | { ph: "N" | "D"; args?: never }
    | { ph: "O"; args: { snapshot: { [key: string]: any } } }
  );

interface EventMetadataBase extends EventBase {
  ph: EventTypeMetadata;
}

export type EventMetadata = EventMetadataBase &
  (
    | { name: "process_name"; args: { name: string } }
    | { name: "process_labels"; args: { labels: string } }
    | { name: "process_sort_index"; args: { sort_index: number } }
    | { name: "thread_name"; args: { name: string } }
    | { name: "thread_sort_index"; args: { sort_index: number } }
  );

export interface EventMemoryDump extends EventBase {
  ph: EventTypeMemoryDump;
  id: string;
}

export interface EventMark extends EventBase {
  ph: EventTypeMark;
  name: string;
}

export interface EventClockSync extends EventBase {
  ph: EventTypeClockSync;
  name: "clock_sync";
  args: {
    sync_id: string;
    issue_ts?: number;
  };
}

export interface EventContext extends EventBase {
  ph: EventTypeContext;
  id: string;
}

export interface EventLink extends EventBase {
  ph: EventTypeLink;
  id: string;
  args: {
    linked_id: string;
  };
}

export interface StackFrameDictionary {
  [frame_id: string]: StackFrame;
}

export interface StackFrame {
  category: string;
  name: string;
  parent?: string;
}

export interface GlobalSample {
  cpu?: number;
  tid: number;
  ts: number;
  name: string;
  sf: string;
  weight: number;
}

export type JSONArrayTrace = Event[];

export interface JSONObjectTrace {
  traceEvents: Event[];
  displayTimeUnit?: "ms" | "ns";
  systemTraceEvents?: string;
  powerTraceAsString?: string;
  stackFrames?: StackFrameDictionary;
  samples?: GlobalSample[];
  controllerTraceDataKey?: string;
  otherData?: { [key: string]: any };
}
