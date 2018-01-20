
function submit() { 
	if (emailAddress.value == null || emailAddress.value == "" || document.getElementById("interestDropdown").options.selectedIndex == 0){
		document.getElementById("errorMessage").textContent = "Please fill out the required fields"; 
		document.getElementById("errorMessage").style.visibility = "visible"; 
	}else{
		validity = validateEmail(emailAddress.value)
	    if (validity){
	    	console.log(emailAddress.value)
	    	console.log(interestDropdown.value)
	    }else{
	    	document.getElementById("errorMessage").textContent = "Please enter a valid email address"; 
	    	document.getElementById("errorMessage").style.visibility = "visible"; 
	    }
	}
}

function validateEmail(email){
    var re = /\S+@\S+/;
    return re.test(email);
}

function removeText(){
	document.getElementById("errorMessage").style.visibility = "hidden"; 
}