import { Component, OnInit } from '@angular/core';
import { WebassemblyService } from '@services/webassembly.service';
import { Sort } from '@features/sort/sort.model';
import { quickSortPartition } from '@services/utils';

@Component({
  selector: 'sort',
  templateUrl: './sort.component.html',
  styleUrls: ['./sort.component.scss'],
})
export class SortComponent implements OnInit {
  feed: (string | number)[] = null;
  private sortWasm: Sort;
  private wasmMemory: any;
  constructor(private readonly webassemblyService: WebassemblyService) {}

  ngOnInit(): void {
    this.webassemblyService.initWasm('/assets/scripts/sort/sort.wasm').then((results) => {
      console.log(results);
      this.wasmMemory = results.instance.exports.memory;
      // this.sortWasm = results.instance.exports._Z9quickSortPfii as Sort;
      this.sortWasm = results.instance.exports._Z9quickSortPiii as Sort;

      this.runTests();
    });
  }

  private runTests(): void {
    // this.test(this.sortJs);
    this.test(this.jsQuickSort.bind(this));
    this.test(this.sortWasm, true);
  }

  private test(method: Sort, isWasm = false): void {
    this.generateFeed(10000000);
    let startTime2;
    let endTime2;
    let diff2 = 0;

    const startTime = performance.now();
    let array;
    if (isWasm) {
      startTime2 = performance.now();
      array = new Float32Array(this.wasmMemory.buffer, 0, this.feed.length);
      array.set(this.feed);
      endTime2 = performance.now();
      diff2 = endTime2 - startTime2;
    } else {
      array = this.feed;
      // array = new Float32Array(this.wasmMemory.buffer, 0, this.feed.length);
    }
    method(!isWasm ? array : array.byteOffset, 0, array.length - 1);

    // console.log(array);

    const endTime = performance.now();
    let diff = endTime - startTime - diff2;
    console.log(diff2);
    if (diff === 0) diff = 0.000000000001;

    console.log(diff);
  }

  private sortJs(data: number[], start: number, end: number): void {
    data.sort((a, b) => a - b);
  }

  private jsQuickSort(data: number[], start: number, end: number): void {
    // base case
    if (start >= end) return;
    // partitioning the array
    const p = quickSortPartition(data, start, end);
    // Sorting the left part
    this.jsQuickSort(data, start, p - 1);
    // Sorting the right part
    this.jsQuickSort(data, p + 1, end);
  }

  private generateFeed(max: number): void {
    this.feed = [];
    for (let i = 0; i < max; i++) {
      this.feed.push(Math.random());
      // this.feed.push(Math.floor(Math.random() * max));
    }
  }
}
