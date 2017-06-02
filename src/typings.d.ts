declare var module: NodeModule;

interface NodeModule {
  id: string;
}

declare module '*package.json' {
  export const name: string;
  export const version: string;
  export const homepage: string;
}
