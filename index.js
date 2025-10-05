import React from ("react");
import ReactDom from ("react-dom");

ReactDom.render( 
 <div>
    <h1> Header 1 </>
	<ul> 
	  <li> Hello </li>
	  <li> You </li>
	  <li> Are </li>
	  <li> Welcome to </li>
	  <li> World </li>
	</>
 </div>, document.getElementById("exercise"));
 
 let h1 = document.createElement("h1");
 h1.innerHTML = "This is my first React Exercise";
 document.getElementById("exercise").appendChild(h1);