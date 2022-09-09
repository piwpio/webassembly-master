"use strict";(self.webpackChunkwebassembly_master=self.webpackChunkwebassembly_master||[]).push([[649],{649:(V,Z,n)=>{n.r(Z),n.d(Z,{FibonacciModule:()=>L});var f=n(9808),y=n(5529),F=n(2916);const b=s=>s<=1?s:b(s-1)+b(s-2),j=s=>{let i=1,a=0,t=0;for(;s>0;)t=i,i+=a,a=t,s--;return a},g=["js","wasm"];var c=n(5832),_=n(7625),e=n(5e3),w=n(2547),A=n(1271),T=n(4106),x=n(7531),R=n(4107),J=n(508),C=n(7423),S=n(773),o=n(6346),v=n(1091);function B(s,i){1&s&&(e.TgZ(0,"div",14),e._UZ(1,"mat-spinner",15),e.qZA()),2&s&&(e.xp6(1),e.Q6J("diameter",32))}function U(s,i){1&s&&(e.TgZ(0,"div",16),e._uU(1,"No results"),e.qZA())}function W(s,i){1&s&&(e.TgZ(0,"th",33),e._uU(1,"Test No."),e.qZA())}function M(s,i){if(1&s&&(e.TgZ(0,"td",34),e._uU(1),e.qZA()),2&s){const a=i.$implicit;e.xp6(1),e.hij("",a.testNo+1,".")}}function Q(s,i){1&s&&(e.TgZ(0,"th",33),e._uU(1,"JS"),e.qZA())}function D(s,i){if(1&s&&(e.TgZ(0,"td",34),e._uU(1),e.qZA()),2&s){const a=i.$implicit,t=e.oxw(2);e.Tol(t.getRowClass(a.js,t.allResults.combined)),e.xp6(1),e.hij(" ",a.js,"ms ")}}function Y(s,i){1&s&&(e.TgZ(0,"th",33),e._uU(1,"WASM"),e.qZA())}function k(s,i){if(1&s&&(e.TgZ(0,"td",34),e._uU(1),e.qZA()),2&s){const a=i.$implicit,t=e.oxw(2);e.Tol(t.getRowClass(a.wasm,t.allResults.combined)),e.xp6(1),e.hij(" ",a.wasm,"ms ")}}function I(s,i){1&s&&e._UZ(0,"tr",35)}function N(s,i){1&s&&e._UZ(0,"tr",36)}function O(s,i){if(1&s&&e._UZ(0,"ngx-charts-number-card",37),2&s){const a=i.$implicit,t=e.oxw(2);e.Q6J("results",t.chartBlockResults[a])("cardColor","#000")}}function P(s,i){if(1&s&&(e.TgZ(0,"div",17)(1,"div",18)(2,"span"),e._uU(3),e.qZA(),e.TgZ(4,"span"),e._uU(5),e.qZA()(),e.TgZ(6,"table",19),e.ynx(7,20),e.YNc(8,W,2,0,"th",21),e.YNc(9,M,2,1,"td",22),e.BQk(),e.ynx(10,23),e.YNc(11,Q,2,0,"th",21),e.YNc(12,D,2,3,"td",24),e.BQk(),e.ynx(13,25),e.YNc(14,Y,2,0,"th",21),e.YNc(15,k,2,3,"td",24),e.BQk(),e.YNc(16,I,1,0,"tr",26),e.YNc(17,N,1,0,"tr",27),e.qZA(),e.TgZ(18,"div",28)(19,"div",29),e.YNc(20,O,1,2,"ngx-charts-number-card",30),e.qZA(),e.TgZ(21,"div",31),e._UZ(22,"ngx-charts-bar-vertical-2d",32),e.qZA()()()),2&s){const a=e.oxw();e.xp6(3),e.hij("JS: ",a.results.js,""),e.xp6(2),e.hij("WASM: ",a.results.wasm,""),e.xp6(1),e.Q6J("dataSource",a.tablePreparedResults),e.xp6(10),e.Q6J("matHeaderRowDef",a.tableDisplayedColumns),e.xp6(1),e.Q6J("matRowDefColumns",a.tableDisplayedColumns),e.xp6(3),e.Q6J("ngForOf",a.fibonacciTests),e.xp6(2),e.Q6J("results",a.chartBarsResults)("legend",!0)("yAxisLabel","time [ms]")("showYAxisLabel",!0)("xAxis",!0)("yAxis",!0)}}let $=(()=>{class s{constructor(a,t,l){this.webassemblyService=a,this.chRef=t,this.matSnackBar=l,this.isReady=!1,this.isRunning=!1,this.getRowClass=c.gT,this.fibonacciTests=g,this.tableDisplayedColumns=["testNo",...g],this.tablePreparedResults=null,this.chartBlockResults=null,this.chartBarsResults=null,this.allResults=null,this.results=null,this.testSuites={},this.allTestSuites={},this.destroy$=new y.xQ}ngOnDestroy(){this.destroy$.next(!0),this.destroy$.complete()}ngOnInit(){this.allTestSuites.jsRecursive=b,this.allTestSuites.jsWhile=j,this.webassemblyService.initWasm("/assets/scripts/fibonacci/fibonacci.wasm").then(a=>{this.allTestSuites.wasmWhile=a.instance.exports.fibonacciWhile,this.allTestSuites.wasmRecursive=a.instance.exports.fibonacciRecursive,this.warmup().subscribe(()=>{this.isReady=!0,this.chRef.markForCheck()})})}runTest(a,t,l=!1){this.areInputsValid(a,t,l)?(this.tablePreparedResults=null,this.isRunning=!0,this.chRef.markForCheck(),setTimeout(()=>{this.test(a,t,l).pipe((0,_.R)(this.destroy$)).subscribe(d=>{this.isRunning=!1,this.prepareResults(t,d),this.chRef.markForCheck()})},500)):this.matSnackBar.open("Invalid inputs")}test(a,t,l){return new F.y(d=>{this.testSuites={js:l?this.allTestSuites.jsRecursive:this.allTestSuites.jsWhile,wasm:l?this.allTestSuites.wasmRecursive:this.allTestSuites.wasmWhile},this.results={js:0,wasm:0};const m={};for(const r of g){m[r]=[];const h=this.testSuites[r];for(let u=0;u<t;u++){const X=performance.now(),z=h(a);let p=performance.now()-X;0===p&&(p=1e-12),this.results[r]=z,m[r].push(l?(0,c.Xp)(p):p)}}d.next(m)})}prepareResults(a,t){var l,d,m,r;this.chartBlockResults={js:[{name:"Best JS recursive",value:(0,c.oq)(t.js)},{name:"Worst JS recursive",value:(0,c.dm)(t.js)},{name:"Average JS recursive",value:(0,c.A5)(t.js)},{name:"Median JS recursive",value:(0,c.rV)(t.js)}],wasm:[{name:"Best WASM while",value:(0,c.oq)(t.wasm)},{name:"Worst WASM while",value:(0,c.dm)(t.wasm)},{name:"Average WASM while",value:(0,c.A5)(t.wasm)},{name:"Median WASM while",value:(0,c.rV)(t.wasm)}]},this.chartBarsResults=[{name:"Best",series:[{name:"JS",value:this.chartBlockResults.js[0].value},{name:"WASM",value:this.chartBlockResults.wasm[0].value}]},{name:"Worst",series:[{name:"JS",value:this.chartBlockResults.js[1].value},{name:"WASM",value:this.chartBlockResults.wasm[1].value}]},{name:"Average",series:[{name:"JS",value:this.chartBlockResults.js[2].value},{name:"WASM",value:this.chartBlockResults.wasm[2].value}]},{name:"Median",series:[{name:"JS",value:this.chartBlockResults.js[3].value},{name:"WASM",value:this.chartBlockResults.wasm[3].value}]}],this.allResults=Object.assign(t,{combined:[...t.js,...t.wasm]});const h=[];for(let u=0;u<a;u++)h.push({testNo:u,js:null!==(d=null===(l=null==t?void 0:t.js)||void 0===l?void 0:l[u])&&void 0!==d?d:-1,wasm:null!==(r=null===(m=null==t?void 0:t.wasm)||void 0===m?void 0:m[u])&&void 0!==r?r:-1});this.tablePreparedResults=h}areInputsValid(a,t,l){return null!=a||(a=0),null!=t||(t=0),!(void 0===l||a<0||t<1||l&&a>40)}warmup(){return this.test(3,1,!1)}}return s.\u0275fac=function(a){return new(a||s)(e.Y36(w.g),e.Y36(e.sBO),e.Y36(A.ux))},s.\u0275cmp=e.Xpm({type:s,selectors:[["fibonacci"]],decls:26,vars:10,consts:[[1,"form__container"],[3,"submit"],["appearance","outline"],["matInput","","type","number","min","0","max","100","value","30",3,"disabled"],["inputFibParam",""],["matInput","","type","number","min","1","max","10","value","10",3,"disabled"],["inputTestsNo",""],[3,"disabled","value"],["algorithm",""],[3,"value"],["mat-flat-button","","color","primary","type","submit",3,"disabled"],["class","loading-container",4,"ngIf"],["class","no-results-container",4,"ngIf"],["class","results-container",4,"ngIf"],[1,"loading-container"],[3,"diameter"],[1,"no-results-container"],[1,"results-container"],[1,"result-numbers"],["mat-table","",1,"mat-elevation-z2",3,"dataSource"],["matColumnDef","testNo"],["mat-header-cell","",4,"matHeaderCellDef"],["mat-cell","",4,"matCellDef"],["matColumnDef","js"],["mat-cell","",3,"class",4,"matCellDef"],["matColumnDef","wasm"],["mat-header-row","",4,"matHeaderRowDef"],["mat-row","",4,"matRowDef","matRowDefColumns"],[1,"charts__container"],[1,"chart__container--card"],[3,"results","cardColor",4,"ngFor","ngForOf"],[1,"chart__container--bar"],[3,"results","legend","yAxisLabel","showYAxisLabel","xAxis","yAxis"],["mat-header-cell",""],["mat-cell",""],["mat-header-row",""],["mat-row",""],[3,"results","cardColor"]],template:function(a,t){if(1&a){const l=e.EpF();e.TgZ(0,"div",0)(1,"form",1),e.NdJ("submit",function(m){e.CHM(l);const r=e.MAs(6),h=e.MAs(11),u=e.MAs(16);return m.preventDefault(),t.runTest(+r.value,+h.value,u.value)}),e.TgZ(2,"mat-form-field",2)(3,"mat-label"),e._uU(4,"Fibonacci param"),e.qZA(),e._UZ(5,"input",3,4),e.qZA(),e.TgZ(7,"mat-form-field",2)(8,"mat-label"),e._uU(9,"Number of tests"),e.qZA(),e._UZ(10,"input",5,6),e.qZA(),e.TgZ(12,"mat-form-field",2)(13,"mat-label"),e._uU(14,"Algorithm"),e.qZA(),e.TgZ(15,"mat-select",7,8)(17,"mat-option",9),e._uU(18,"While loop"),e.qZA(),e.TgZ(19,"mat-option",9),e._uU(20,"Recursive"),e.qZA()()(),e.TgZ(21,"button",10),e._uU(22,"Run benchmark"),e.qZA()()(),e.YNc(23,B,2,1,"div",11),e.YNc(24,U,2,0,"div",12),e.YNc(25,P,23,12,"div",13)}2&a&&(e.xp6(5),e.Q6J("disabled",!t.isReady||t.isRunning),e.xp6(5),e.Q6J("disabled",!t.isReady||t.isRunning),e.xp6(5),e.Q6J("disabled",!t.isReady||t.isRunning)("value",!1),e.xp6(2),e.Q6J("value",!1),e.xp6(2),e.Q6J("value",!0),e.xp6(2),e.Q6J("disabled",!t.isReady||t.isRunning),e.xp6(2),e.Q6J("ngIf",t.isRunning),e.xp6(1),e.Q6J("ngIf",!t.isRunning&&0===(null==t.tablePreparedResults?null:t.tablePreparedResults.length)),e.xp6(1),e.Q6J("ngIf",!t.isRunning&&(null==t.tablePreparedResults?null:t.tablePreparedResults.length)))},directives:[T.KE,T.hX,x.Nt,R.gD,J.ey,C.lW,f.O5,S.Ou,o.BZ,o.w1,o.fO,o.ge,o.Dz,o.ev,o.as,o.XQ,o.nj,o.Gk,f.sg,v.vg,v.H5],styles:[""],changeDetection:0}),s})();var q=n(8555);const H=[{path:"",component:$}];let L=(()=>{class s{}return s.\u0275fac=function(a){return new(a||s)},s.\u0275mod=e.oAB({type:s}),s.\u0275inj=e.cJS({imports:[[f.ez,q.Bz.forChild(H),T.lN,x.c,C.ot,A.ZX,o.p0,S.Cq,v.eC,v.pT,R.LD]]}),s})()}}]);