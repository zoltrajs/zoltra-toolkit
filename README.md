# Zoltra Toolkit

A modular toolkit of React and Node.js utilities, components, and configurations—built and maintained under the `@zoltra-toolkit` scope. Designed for scalability, reusability, and an exceptional developer experience.

> Monorepo powered by npm workspaces.

---

## 📦 Packages

| Package                                     | Version                                                    | Description                                    |
| ------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------- |
| [`@zoltra-toolkit/react`](./packages/react) | ![npm](https://img.shields.io/npm/v/@zoltra-toolkit/react) | React utilities, hooks, and UI components      |
| [`@zoltra-toolkit/node`](./packages/node)   | ![npm](https://img.shields.io/npm/v/@zoltra-toolkit/node)  | Node.js helpers, configs, and shared libraries |

---

## 🛠️ Getting Started

### Clone the Repo

```bash
git clone https://github.com/zoltrajs/zoltra-toolkit.git
cd zoltra-toolkit
pnpm install
```

## Workspaces

### Ensure your root package.json contains:

```bash
{
  "name": "zoltra-toolkit",
  "private": true,
  "workspaces": [
    "packages/*"
  ]
}
```

## 🔨 Build All Packages

```bash
npm run build
```

Each package should have its own build script, for example in **packages/react/package.json**:

```json
{
  "name": "@zoltra-toolkit/react",
  "version": "0.1.0",
  "main": "dist/index.js",
  "scripts": {
    "build": "rollup -c"
  }
}
```

## 📁 Directory Structure

```bash
zoltra-toolkit/
├── packages/
│   ├── react/      # React utilities, hooks & components
│   └── node/       # Node.js utilities & configurations
├── package.json    # Root workspace config
└── README.md
```

## 🚀 Publishing

Publish each package independently under the `@zoltra-toolkit` scope:

```bash
# e.g. for the React package
cd packages/react
npm publish --access public
```

## 💬 Contributing

Contributions are welcome! Feel free to open issues or PRs. See

## 📝 License

[MIT](./LICENSE) © Zoltra Toolkit
