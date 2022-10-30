import {
  Event,
  EventClockSync,
  EventComplete,
  EventDuration,
  EventInstant,
  EventMark,
  EventMetadata,
  EventSample,
  JSONArrayTrace,
  JSONObjectTrace,
} from "../src/types";

// See reference documentation:
// - https://docs.google.com/document/d/1CvAClvFfyA5R-PhYUmn5OOQtYMH4h6I0nSsKchNAySU/edit?usp=sharing

describe("types", () => {
  describe("JSONArrayTrace", () => {
    it("matches reference documentation", () => {
      const a: JSONArrayTrace = [
        { name: "Asub", cat: "PERF", ph: "B", pid: 22630, tid: 22630, ts: 829 },
        { name: "Asub", cat: "PERF", ph: "E", pid: 22630, tid: 22630, ts: 833 },
      ];
    });
  });

  describe("JSONArrayTrace", () => {
    it("matches reference documentation", () => {
      const a: JSONObjectTrace = {
        traceEvents: [
          {
            name: "Asub",
            cat: "PERF",
            ph: "B",
            pid: 22630,
            tid: 22630,
            ts: 829,
          },
          {
            name: "Asub",
            cat: "PERF",
            ph: "E",
            pid: 22630,
            tid: 22630,
            ts: 833,
          },
        ],
        displayTimeUnit: "ns",
        systemTraceEvents: "SystemTraceData",
        otherData: {
          version: "My Application v1.0",
        },
        stackFrames: {},
        samples: [],
      };
    });
  });

  describe("Event", () => {
    it("matches reference documentation", () => {
      const a: Event = {
        name: "myName",
        cat: "category,list",
        ph: "B",
        ts: 12345,
        pid: 123,
        tid: 456,
        args: {
          someArg: 1,
          anotherArg: {
            value: "my value",
          },
        },
      };
    });
  });

  describe("EventDuration", () => {
    it("matches reference documentation", () => {
      const a: EventDuration = {
        name: "myFunction",
        cat: "foo",
        ph: "B",
        ts: 123,
        pid: 2343,
        tid: 2347,
        args: {
          first: 1,
        },
      };

      const b: EventDuration = {
        ph: "E",
        ts: 145,
        pid: 2343,
        tid: 2347,
        args: {
          first: 4,
          second: 2,
        },
      };

      const c: JSONObjectTrace = {
        traceEvents: [
          { ts: 100, pid: 1, tid: 1, ph: "B", name: "A", sf: 7 },
          { ts: 101, pid: 1, tid: 1, ph: "E", name: "A", sf: 9 },
        ],
        stackFrames: {
          "5": { name: "main", category: "my app" },
          "7": { parent: "5", name: "SomeFunction", category: "my app" },
          "9": { parent: "5", name: "SomeFunction", category: "my app" },
        },
      };

      const d: EventDuration = {
        ts: 100,
        pid: 1,
        tid: 1,
        ph: "B",
        name: "A",
        stack: ["0x1", "0x2"],
      };
    });
  });

  describe("EventComplete", () => {
    it("matches reference documentation", () => {
      const a: EventComplete = {
        name: "myFunction",
        cat: "foo",
        ph: "X",
        ts: 123,
        dur: 234,
        pid: 2343,
        tid: 2347,
        args: {
          first: 1,
        },
      };
    });
  });

  describe("EventInstant", () => {
    it("matches reference documentation", () => {
      const a: EventInstant = {
        name: "OutOfMemory",
        ph: "i",
        ts: 1234523.3,
        pid: 2343,
        tid: 2347,
        s: "g",
      };
    });
  });

  describe("EventCounter", () => {
    it("matches reference documentation", () => {
      const a: JSONArrayTrace = [
        {
          pid: 2343,
          tid: 2347,
          name: "ctr",
          ph: "C",
          ts: 0,
          args: { cats: 0, dogs: 7 },
        },
        {
          pid: 2343,
          tid: 2347,
          name: "ctr",
          ph: "C",
          ts: 10,
          args: { cats: 10, dogs: 4 },
        },
        {
          pid: 2343,
          tid: 2347,
          name: "ctr",
          ph: "C",
          ts: 20,
          args: { cats: 0, dogs: 1 },
        },
      ];
    });
  });

  describe("EventAsync", () => {
    it("matches reference documentation", () => {
      const a: JSONArrayTrace = [
        { cat: "foo", name: "url_request", ph: "b", ts: 0, id: "0x100" },
        { cat: "foo", name: "url_headers", ph: "b", ts: 1, id: "0x100" },
        { cat: "foo", name: "http_cache", ph: "n", ts: 3, id: "0x100" },
        {
          cat: "foo",
          name: "url_headers",
          ph: "e",
          ts: 2,
          id: "0x100",
          args: {
            step: "headers_complete",
            response_code: 200,
          },
        },
        { cat: "foo", name: "url_request", ph: "e", ts: 4, id: "0x100" },
      ];
    });
  });

  describe("EventSample", () => {
    it("matches reference documentation", () => {
      const a: EventSample = {
        name: "sample",
        cat: "foo",
        ph: "P",
        ts: 123,
        pid: 234,
        tid: 645,
      };
    });
  });

  describe("EventObject", () => {
    it("matches reference documentation", () => {
      const a: JSONArrayTrace = [
        { name: "MyObject", ph: "N", id: "0x1000", ts: 0, pid: 1, tid: 1 },
        { name: "MyObject", ph: "D", id: "0x1000", ts: 20, pid: 1, tid: 1 },
        {
          name: "MyOtherObject",
          ph: "N",
          id: "0x1000",
          ts: 20,
          pid: 1,
          tid: 1,
        },
        {
          name: "MyOtherObject",
          ph: "D",
          id: "0x1000",
          ts: 25,
          pid: 1,
          tid: 1,
        },
        {
          name: "MyObject",
          ph: "N",
          id: "0x1000",
          scope: "some_scope",
          ts: 0,
          pid: 1,
          tid: 1,
        },
        {
          name: "MyObject",
          id: "0x1000",
          ph: "O",
          ts: 10,
          pid: 1,
          tid: 1,
          args: {
            snapshot: {},
          },
        },
        {
          name: "MyObject",
          id: "0x1000",
          ph: "O",
          ts: 10,
          pid: 1,
          tid: 1,
          cat: "cat",
          args: {
            snapshot: {
              cat: "real_cat",
              base_type: "MyObject",
              id_ref: "0x1000",
            },
          },
        },
      ];
    });
  });

  describe("EventMetadata", () => {
    it("matches reference documentation", () => {
      const a: EventMetadata = {
        name: "thread_name",
        ph: "M",
        pid: 2343,
        tid: 2347,
        args: {
          name: "RendererThread",
        },
      };
    });
  });

  describe("EventMemoryDump", () => {
    it("matches reference documentation", () => {
      const a: JSONArrayTrace = [
        { id: "dump_id", ts: 10, ph: "V", args: {} },
        { id: "dump_id", ts: 11, ph: "v", pid: 42, args: {} },
      ];
    });
  });

  describe("EventMark", () => {
    it("matches reference documentation", () => {
      const a: EventMark = {
        name: "firstLayout",
        ts: 10,
        ph: "R",
        cat: "blink.user_timing",
        pid: 42,
        tid: 983,
      };
    });
  });

  describe("EventClockSync", () => {
    it("matches reference documentation", () => {
      const a: EventClockSync = {
        name: "clock_sync",
        ph: "c",
        ts: 123,
        args: {
          sync_id: "guid1",
        },
      };

      const b: EventClockSync = {
        name: "clock_sync",
        ph: "c",
        ts: 6790,
        args: {
          sync_id: "guid1",
          issue_ts: 6789,
        },
      };
    });
  });

  describe("EventContext", () => {
    it("matches reference documentation", () => {
      const a: JSONArrayTrace = [
        { name: "SomeContextType", ph: "(", ts: 123, id: "0x1234" },
        { name: "SomeContextType", ph: ")", ts: 123, id: "0x1234" },
      ];
    });
  });

  describe("EventLink", () => {
    it("matches reference documentation", () => {
      const a: JSONArrayTrace = [
        { cat: "foo", name: "async_read", ph: "b", id: "0x1000" },
        {
          cat: "foo",
          name: "link",
          ph: "=",
          id: "0x1000",
          args: { linked_id: "0x2000" },
        },
        { cat: "foo", name: "async_read", ph: "e", id: "0x2000" },
      ];
    });
  });
});
