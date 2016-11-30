var cheerio = require('cheerio');
var nightmare = require('nightmare');

module.exports = function( params, SuccessCallback, ErrorCallback ) {

	this.host = params.host.replace(/\/?$/, '/');
	this.username = params.username;
	this.password = params.password;
	this.nightmare = new nightmare({ waitTimeout: 5000 });

	function parseAmount(amount) {
		amount = amount.replace(/[^\d.-]/g, '');
		if (amount > 0) {
			return amount.replace(/[^\d.-]/g, '');
		} else {
			return 0;
		}
	}

	function handleRequest( body ) {
		$ = cheerio.load(body);

		var earnings = $("#ebContainer_monthly .ebClass .databox-title").first().text();
		var signups = $("#Signups_monthly .databox-title").text()
		var ftd = $("div[id='First Time Depositing_monthly'] .databox-title").text()
		
		SuccessCallback({
			'earnings': parseAmount(earnings),
			'signups': parseAmount(signups),
			'ftd': parseAmount(ftd),
		});
	}

	this.nightmare
		.goto(this.host + 'affiliates/Account/Login')
		.insert('#txtUsername', this.username)
		.insert('#txtPassword', this.password)
		.click('#btnLogin')
		.wait('a[href="#monthly"]')
		.click('a[href="#monthly"]')
		.wait('div[id="First Time Depositing_monthly"] .databox-title')
		.evaluate(function() {
			return document.body.innerHTML;
		})
		.then(function(body) {
			handleRequest(body);
		})
		.catch(function (error) {
			if (error == "Error: .wait() timed out after 5000msec") {
				error = "Wrong username, password or login limit (max once per 60 seconds) exceeded."
			}
			if (ErrorCallback) {
				ErrorCallback(error);
			} else {
				console.log(error);
			}
			
		});

};