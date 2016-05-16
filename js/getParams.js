function getParams(GET_param) {
	var arr_params = [],
	    arr_value_and_key = [],
	    params = [];

	if(GET_param != "") {
		arr_params = (GET_param.substr(1)).split('&');
		for(var i = 0; i < arr_params.length; i++) {
			arr_value_and_key = arr_params[i].split('=');
			params[arr_value_and_key[0]] = arr_value_and_key[1];
		}
	}

	return params;
}
