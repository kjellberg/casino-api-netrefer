# Netrefer Earnings scraper
## A node.js package for my "Casino Earnings"-Application

Collect stats as total earnings, signups and first time depositors for the current month.

### Install
```javascript
npm install -save casino-api-netrefer
```

### Example:
```javascript
var Netrefer = require('casino-api-netrefer');

new Netrefer({
	'username': 'affiliateusername',
	'password': 'mysecretpassword'
}, function(response) {
  console.log(response);
  /*
  { earnings: '543.61', signups: '22', ftd: '8' }
  */
});
