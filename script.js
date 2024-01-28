function manageImports() {

	// Get all elements
	elements = document.getElementsByTagName("*");

	// For each element
	for (let element of elements) {

		// If there is an attribute "import"
		filename = element.getAttribute("import");
		if (filename) {
			// Make an HTTP request to import html into the element inner html
			xhttp = new XMLHttpRequest();
      		xhttp.onreadystatechange = function() {
				if (this.readyState == 4) {
					if (this.status == 200) {element.innerHTML = this.responseText;}
					if (this.status == 404) {element.innerHTML = "Page not found.";}
					
					// Remove attribute and run again
					element.removeAttribute("import");
					manageImports();
				}
      		}
			xhttp.open("GET", filename, true);
			xhttp.send();
			
			// Exit
			return;
		}
	}
}

function onSignIn(googleUser) {
	var profile = googleUser.getBasicProfile();
	document.cookie = `username=${profile.getName()}; image_url=${profile.getImageUrl()}; email=${profile.getEmail()}}`
	alert("Signed In");
	console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
	console.log('Name: ' + profile.getName());
	console.log('Image URL: ' + profile.getImageUrl());
	console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

	window.location.href = "./index.html";
}
window.onSignIn = onSignIn;

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
		document.cookie="username=; image_url=; email=;";
    	console.log('User signed out.');
	});
}

function getCookieValue(name) {
	document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
} 

document.addEventListener("DOMContentLoaded", function() {
	manageImports();
	document.cookie = "username=; img_url=; email=;"

	signInTab = document.querySelector("#signin-tab");
	if (signInTab) {
		if (!getCookieValue("username")) {
			signInTab.innerHTML = `
			<h1>Welcome!</h1>
			<p>Sign in using your Google Account by clicking the button below.</p>
			<div id="signin-button">
				<div class="g-signin2" data-width="240" data-height="50" data-longtitle="true" data-theme="dark" data-onsuccess="onSignIn">Sign In</div>
			</div>`
		}
		else {
			alert("Cookies look like this: " + document.cookie);
			alert("this other thing: " + getCookieValue("username"));
			signInTab.innerHTML = `<a href="#" class="btn btn-secondary-outline" onclick="signOut();">Sign out</a>`;
		}
	}
});