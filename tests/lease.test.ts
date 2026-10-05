import { describe, expect, it } from "vitest";
import { canAttach, consumeLease, createLease, selectFile } from "../src/lease.js";

describe("one-use file lease", () => {
  it("accepts a file at the 10 MiB boundary", () => {
    const lease = selectFile(createLease(), { name: "brief.pdf", size: 10 * 1024 * 1024, type: "application/pdf" });
    expect(canAttach(lease)).toBe(true);
  });

  it("rejects a file above the 10 MiB boundary", () => {
    const lease = selectFile(createLease(), { name: "large.zip", size: 10 * 1024 * 1024 + 1, type: "application/zip" });
    expect(canAttach(lease)).toBe(false);
    expect(lease.reason).toBe("File is larger than 10 MiB.");
  });

  it("consumes a selected file and blocks a second attach", () => {
    const selected = selectFile(createLease(), { name: "notes.txt", size: 42, type: "text/plain" });
    const consumed = consumeLease(selected);
    expect(consumed.status).toBe("consumed");
    expect(canAttach(consumed)).toBe(false);
    expect(consumeLease(consumed).status).toBe("consumed");
  });
});
