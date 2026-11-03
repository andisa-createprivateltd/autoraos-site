import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const pricing = read("src/app/pricing/page.tsx");
const workflow = read("src/app/how-it-works/page.tsx");
const home = read("src/components/pages/home-audi-v2.tsx");
const css = read("src/app/globals.css");

const assertions = [
  ["pricing has no legacy rounded or gradient utilities", !/(rounded-|gradient)/.test(pricing)],
  ["workflow has no legacy gradient utility", !/gradient/.test(workflow)],
  ["home has real control-layer links", home.includes("<Link key={layer.index} href={layer.href}")],
  ["home has real operating-note links", home.includes("<Link href={href}")],
  ["scroll reveal is wired into the public system", home.includes("ScrollReveal") && css.includes(".scroll-reveal[data-visible=\"true\"]")],
  ["floating support is not mounted in the root layout", !read("src/app/layout.tsx").includes("WhatsAppFloat")]
];

if (process.argv[2] === "source") {
  const failures = assertions.filter(([, ok]) => !ok);
  if (failures.length) {
    console.error(failures.map(([label]) => `FAIL: ${label}`).join("\n"));
    process.exit(1);
  }
  console.log("design source verification passed");
} else if (process.argv[2] === "deployment") {
  const url = process.env.AUTORA_PREVIEW_URL;
  if (!url) throw new Error("AUTORA_PREVIEW_URL is required");
  const response = await fetch(url, { redirect: "follow" });
  const body = await response.text();
  const required = [
    "Revenue control infrastructure for dealership networks",
    "Commercial architecture / governance scope",
    "One governed flow from enquiry"
  ];
  const missing = required.filter((text) => !body.includes(text));
  if (!response.ok || missing.length) {
    console.error(JSON.stringify({ status: response.status, missing }));
    process.exit(1);
  }
  console.log("deployment verification passed");
} else {
  console.error("Usage: node scripts/verify-design-pass.mjs source|deployment");
  process.exit(1);
}
