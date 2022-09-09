import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class WebassemblyService {
  constructor(private readonly http: HttpClient) {}

  initWasm(url: string, imports: WebAssembly.Imports = {}): Promise<WebAssembly.WebAssemblyInstantiatedSource> {
    return this.http
      .get(url + '?t=' + Date.now(), { responseType: 'arraybuffer' })
      .pipe(mergeMap((bytes) => WebAssembly.instantiate(bytes, imports)))
      .toPromise();
  }

  loadScript(id: string, url: string): Promise<void> {
    let script = document.getElementById(id) as HTMLScriptElement;
    if (script) {
      return Promise.resolve();
    }

    return new Promise<void>((resolve, reject) => {
      script = document.createElement('script');
      document.body.appendChild(script);

      script.onload = () => resolve();
      script.onerror = (ev: ErrorEvent) => reject(ev.error);
      script.id = id;
      script.async = true;
      script.src = url;
    });
  }
}
