import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build as esbuild } from "esbuild";
import esbuildPluginPino from "esbuild-plugin-pino";
import { rm } from "node:fs/promises";
import { readFile } from "node:fs/promises";

// Plugins (e.g. 'esbuild-plugin-pino') may use `require` to resolve dependencies
globalThis.require = createRequire(import.meta.url);

const artifactDir = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(artifactDir, "..", "..");

/**
 * Reads workspace package.json files to discover all @workspace/* package names.
 * These are local TypeScript sources that should be bundled, not externalized.
 */
async function getWorkspacePackages() {
  const workspacePkgPaths = [
    path.join(workspaceRoot, "lib", "api-zod", "package.json"),
    path.join(workspaceRoot, "lib", "api-client-react", "package.json"),
    path.join(workspaceRoot, "lib", "db", "package.json"),
  ];
  const names = new Set();
  for (const pkgPath of workspacePkgPaths) {
    try {
      const json = JSON.parse(await readFile(pkgPath, "utf8"));
      if (json.name) names.add(json.name);
    } catch (_) {
      // ignore missing packages
    }
  }
  return names;
}

async function buildAll() {
  const distDir = path.resolve(artifactDir, "dist");
  await rm(distDir, { recursive: true, force: true });

  const workspacePkgNames = await getWorkspacePackages();

  /**
   * Smart external plugin:
   * - Local @workspace/* packages → bundle (they are TypeScript sources)
   * - All other bare npm specifiers → external (resolved from node_modules at runtime)
   * - Relative imports → always bundled (default esbuild behaviour)
   */
  const smartExternalPlugin = {
    name: "smart-external",
    setup(build) {
      // Match ONLY bare npm specifiers (e.g. 'express', '@scope/pkg')
      // NOT relative imports ('./foo'), NOT absolute paths ('C:\...' or '/...')
      build.onResolve({ filter: /^(@[a-z0-9-~][a-z0-9-._~]*\/[a-z0-9-._~]+|[a-z0-9-~][a-z0-9-._~]*)/ }, (args) => {
        // Skip if it's an absolute path (Windows or Unix)
        if (path.isAbsolute(args.path)) return null;
        // Let workspace packages be bundled (they are local TS sources)
        if (workspacePkgNames.has(args.path)) return null;
        return { path: args.path, external: true };
      });
    },
  };

  await esbuild({
    entryPoints: [path.resolve(artifactDir, "src/index.ts")],
    platform: "node",
    bundle: true,
    format: "esm",
    outdir: distDir,
    outExtension: { ".js": ".mjs" },
    logLevel: "info",
    external: ["*.node"],
    sourcemap: "linked",
    plugins: [
      smartExternalPlugin,
      // pino relies on workers to handle logging; use plugin instead of externalizing
      esbuildPluginPino({ transports: ["pino-pretty"] }),
    ],
    // Make packages that are CJS-only (e.g. express) work in our ESM output
    banner: {
      js: `import { createRequire as __bannerCrReq } from 'node:module';
import __bannerPath from 'node:path';
import __bannerUrl from 'node:url';

globalThis.require = __bannerCrReq(import.meta.url);
globalThis.__filename = __bannerUrl.fileURLToPath(import.meta.url);
globalThis.__dirname = __bannerPath.dirname(globalThis.__filename);
    `,
    },
  });
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
