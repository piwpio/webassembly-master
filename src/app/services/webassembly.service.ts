import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class WebassemblyService {
  constructor(private readonly http: HttpClient) {}

  initWasm(url: string, imports?: WebAssembly.Imports): Promise<WebAssembly.WebAssemblyInstantiatedSource> {
    return this.http
      .get(url, { responseType: 'arraybuffer' })
      .pipe(mergeMap((bytes) => WebAssembly.instantiate(bytes, imports)))
      .toPromise();
  }
}
