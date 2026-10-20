const assert = require("node:assert/strict");
const { test } = require("node:test");
const fs = require("node:fs");
const ts = require("typescript");

const source = fs.readFileSync("src/lib/travellerDetails.ts", "utf8");
const js = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const loaded = { exports: {} };
new Function("exports", "module", js)(loaded.exports, loaded);
const { validateTravellers, csvCell, formatBirthDate } = loaded.exports;
const valid = { given_names: "María Anne", surname: "O'Neill-Santos", date_of_birth: "1992-02-29" };

test("accepts passport names with accents, spaces, apostrophes and hyphens", () => {
  assert.equal(validateTravellers([valid], true), "");
});
test("requires explicit confirmation and complete details for every traveller", () => {
  assert.match(validateTravellers([valid], false), /confirmation/);
  assert.match(validateTravellers([valid, { ...valid, given_names: "  " }], true), /traveller 2/);
});
test("rejects impossible, future, empty and out-of-range dates", () => {
  for (const dob of ["1991-02-29", "2000-04-31", "2999-01-01", "", "1899-01-01"]) {
    assert.match(validateTravellers([{ ...valid, date_of_birth: dob }], true), /valid date/);
  }
  assert.equal(formatBirthDate("1992-02-29"), "29 Feb 1992");
});
test("CSV escapes embedded quotes and neutralizes spreadsheet formulas", () => {
  assert.equal(csvCell('Name "Example", Jr'), '"Name ""Example"", Jr"');
  assert.equal(csvCell("=HYPERLINK(\"evil\")"), '"\'=HYPERLINK(""evil"")"');
  assert.equal(csvCell(" \t+123"), '"\' \t+123"');
  assert.equal(csvCell("María"), '"María"');
});
