#!/usr/bin/env node

const { spawn } = require("node:child_process");

const normalizedBundler = (process.env.CALCOM_NEXT_DEV_BUNDLER || "").trim().toLowerCase();

const useWebpack =
  normalizedBundler === "webpack" ||
  (normalizedBundler !== "turbopack" && process.platform === "win32");

const args = ["dev", ...(useWebpack ? ["--webpack"] : ["--turbopack"]), ...process.argv.slice(2)];

const child = spawn("next", args, {
  stdio: "inherit",
  shell: process.platform === "win32",
  env: process.env,
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 1);
});
