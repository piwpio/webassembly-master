export interface EmscriptenReadFileOptions {
  encoding?: 'utf8' | 'binary';
  flags?: string;
}

export interface CcallOptions {
  async?: boolean;
}

export interface EmscriptenModule {
  preRun?: (() => void)[];
  postRun?: () => void;
  canvas?: HTMLCanvasElement;
  arguments?: string[];
  print?(what: string): void;
  printErr?(what: string): void;
  _getMs?(): number;
  __Z5getMsv?(): number;
  locateFile?(file: string): string;
  // @ts-ignore
  ccall?(funcName: string, returnType: string, argumentTypes: string[], arguments: any[], options?: CcallOptions): any;
  FS_createDataFile?(
    parent: string,
    name: string,
    data: string | Uint8Array,
    canRead?: boolean,
    canWrite?: boolean,
    canOwn?: boolean
  ): void;
  FS_createPreloadedFile?(parent: string, name: string, url: string, canRead?: boolean, canWrite?: boolean): void;
  FS_readFile?(url: string, options?: EmscriptenReadFileOptions): any;
  FS_unlink?(path: string): void;
}
