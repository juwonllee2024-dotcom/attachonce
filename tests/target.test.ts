import { describe, expect, it } from "vitest";
import { chooseUploadTarget, isUploadLabel } from "../src/target.js";

describe("upload target selection", () => {
  it("accepts exactly one upload control", () => {
    expect(chooseUploadTarget(1)).toBe("unique");
  });

  it("refuses zero or ambiguous controls", () => {
    expect(chooseUploadTarget(0)).toBe("none");
    expect(chooseUploadTarget(2)).toBe("ambiguous");
  });

  it("recognizes upload labels without guessing unrelated buttons", () => {
    expect(isUploadLabel("Upload a file")).toBe(true);
    expect(isUploadLabel("Attach document")).toBe(true);
    expect(isUploadLabel("Send message")).toBe(false);
  });
});
