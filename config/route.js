import {login} from '@/config/login.js'
uni.$u.routeIntercept = function(config,resolve) {
	if(login()){
		resolve(true)
	}
}
