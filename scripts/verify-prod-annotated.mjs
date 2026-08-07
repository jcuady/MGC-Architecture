const urls = [
  "https://www.mgcarchitecture.com/",
  "https://www.mgcarchitecture.com/process",
  "https://www.mgcarchitecture.com/estimate",
  "https://www.mgcarchitecture.com/inquire",
  "https://www.mgcarchitecture.com/contact",
  "https://www.mgcarchitecture.com/about",
];

let fail = 0;
function ok(name, pass, detail = "") {
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!pass) fail += 1;
}

for (const url of urls) {
  const res = await fetch(url, { cache: "no-store", redirect: "follow" });
  const html = await res.text();
  ok(`${url} ${res.status}`, res.status === 200);

  if (url.endsWith(".com/")) {
    const nav = html.match(/aria-label="Primary"[\s\S]*?<\/nav>/)?.[0] ?? "";
    ok("prod nav Blog before About", /Blog[\s\S]*About/.test(nav) && !/About[\s\S]*Blog/.test(nav));
    const aboutIdx = html.indexOf('id="about"');
    const about = aboutIdx >= 0 ? html.slice(aboutIdx, aboutIdx + 10000) : "";
    ok("prod about no Education", !/>Education</.test(about));
    ok("prod about Learn More", about.includes("/about") && /Learn More/i.test(about));
  }
  if (url.includes("/process")) {
    ok("prod process no Finish Level", !html.includes("Finish Level"));
  }
  if (url.includes("/estimate")) {
    ok("prod estimate has Finish Level", /Finish Level/i.test(html) || /Cost Estimate Calculator/i.test(html));
  }
  if (url.includes("/inquire")) {
    ok(
      "prod inquire Inspiration & Details",
      html.includes("Inspiration &amp; Details") || html.includes("Inspiration & Details"),
    );
  }
  if (url.includes("/contact")) {
    ok("prod contact handles", html.includes("@mgcarchitecture") && html.includes("@mgcarchitectureph"));
  }
}

console.log(fail === 0 ? "\nPROD CHECK OK" : `\n${fail} FAILED`);
process.exit(fail === 0 ? 0 : 1);
