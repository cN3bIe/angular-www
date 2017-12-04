export default class LS {
	static set(name,data){
		localStorage.setItem(name,JSON.stringify(data) );
	}
	static get(name){
		return JSON.parse( localStorage.getItem(name) );
	}
	static clear(){
		localStorage.clear(); location.reload();
	}
};