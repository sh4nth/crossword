(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{14:function(t,e,n){},15:function(t,e,n){},16:function(t,e,n){"use strict";n.r(e);var a=n(0),r=n.n(a),s=n(7),i=n.n(s),o=(n(14),n(1)),c=n(2),l=n(4),u=n(3),h=n(5);n(15);var d={display:"flex",alignItems:"center",justifyContent:"center",fill:"black",fontSize:"10px"},f=function(t){function e(t){var n;return Object(o.a)(this,e),(n=Object(l.a)(this,Object(u.a)(e).call(this,t))).state=t,n}return Object(h.a)(e,t),Object(c.a)(e,[{key:"render",value:function(){return r.a.createElement("g",{key:this.state.id,id:this.state.id},r.a.createElement("rect",{x:40*this.state.x,y:40*this.state.y,width:40,height:40,style:(t=this.state.fillable,{display:"flex",alignItems:"center",justifyContent:"center",fill:t?"white":"black",stroke:"rgb(55,55,55)",strokeWidth:1})}),r.a.createElement("text",{x:40*this.state.x+2,y:40*this.state.y+10,style:d,key:"clue"+this.state.x+","+this.state.y},(this.state.x+this.state.y)%30));var t}}]),e}(a.Component);function b(t,e){return!((t*e*t*e*t+e*e*e+t*t*t*t-3*e+e*e)%100>80||t%2==1&&e%2==1)}var w=function(t){function e(t){var n;Object(o.a)(this,e),(n=Object(l.a)(this,Object(u.a)(e).call(this,t))).renderBoxes=function(){var t=[];return n.state.boxes.forEach(function(e){t.push(e.render())}),t};for(var a=[],r=0;r<15;r++)for(var s=0;s<15;s++)a.push(new f({id:"B"+r+"-"+s,fillable:b(r,s),letter:"A",x:r,y:s}));return n.state={boxes:a},n}return Object(h.a)(e,t),Object(c.a)(e,[{key:"render",value:function(){return r.a.createElement("div",{className:"Crossword"},r.a.createElement("svg",{id:"crossword-svg",viewBox:"0 0 600 600",xmlns:"http://www.w3.org/2000/svg"},this.renderBoxes()))}}]),e}(a.Component),m=function(t){function e(){return Object(o.a)(this,e),Object(l.a)(this,Object(u.a)(e).apply(this,arguments))}return Object(h.a)(e,t),Object(c.a)(e,[{key:"render",value:function(){return r.a.createElement("div",{className:"Crossword"},r.a.createElement(w,null))}}]),e}(a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(r.a.createElement(m,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(t){t.unregister()})},8:function(t,e,n){t.exports=n(16)}},[[8,1,2]]]);
//# sourceMappingURL=main.88832603.chunk.js.map