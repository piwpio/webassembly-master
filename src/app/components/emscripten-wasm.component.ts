import { AfterViewInit, Component } from '@angular/core';
import { EmscriptenService } from '@services/emscripten.service';
import { EmscriptenModule } from '@models/emscripten.model';

type EmscriptenModuleDecorator<M extends EmscriptenModule> = (module: M) => void;

const noopModuleDecorator = (mod: EmscriptenModule) => mod;

@Component({})
export abstract class EmscriptenWasmComponent<M extends EmscriptenModule = EmscriptenModule> implements AfterViewInit {
  protected moduleDecorator: EmscriptenModuleDecorator<M>;
  private resolvedModule: M;

  protected constructor(
    private moduleExportName: string,
    private jsLoader: string,
    private scriptPath: string,
    protected emscriptenService: EmscriptenService
  ) {}

  get module(): M {
    return this.resolvedModule;
  }

  ngAfterViewInit(): void {
    this.resolveModule();
  }

  protected resolveModule(): void {
    this.emscriptenService
      .loadScript(this.moduleExportName, `${this.scriptPath}/${this.jsLoader}?ts=${Date.now()}`)
      .then(() => {
        const module = {
          locateFile: (file: string) => `${this.scriptPath}/${file}?ts=${Date.now()}`,
        } as M;
        const moduleDecorator: EmscriptenModuleDecorator<M> = this.moduleDecorator || noopModuleDecorator;
        moduleDecorator(module);

        return window[this.moduleExportName](module);
      })
      .then((mod) => {
        this.resolvedModule = mod;
      });
  }
}
