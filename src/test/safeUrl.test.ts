import { describe, it, expect } from "vitest";
import { safeUrl, safeHref, safeImageSrc, isHttpUrl } from "@/lib/safeUrl";

describe("safeUrl", () => {
  it("keeps http(s) URLs", () => {
    expect(safeUrl("https://www.alibaba.com/x?a=1")).toBe("https://www.alibaba.com/x?a=1");
    expect(safeUrl(" http://example.com ")).toBe("http://example.com/");
  });
  it("drops dangerous or relative values", () => {
    for (const v of ["javascript:alert(1)", " JaVaScRiPt:alert(1)", "java\tscript:alert(1)", "data:text/html,<script>1</script>", "vbscript:x", "/relative", "//evil.com", "", null, undefined, 42]) {
      expect(safeUrl(v)).toBeUndefined();
    }
    expect(safeHref("javascript:alert(1)")).toBe("#");
    expect(isHttpUrl("ftp://x.com")).toBe(false);
  });
  it("allows image data/blob only for images", () => {
    expect(safeImageSrc("data:image/png;base64,AAAA")).toBe("data:image/png;base64,AAAA");
    expect(safeImageSrc("blob:https://tikprofitpro.shop/abc")).toBe("blob:https://tikprofitpro.shop/abc");
    expect(safeImageSrc("data:text/html,x")).toBeUndefined();
    expect(safeImageSrc("javascript:x")).toBeUndefined();
  });
});
