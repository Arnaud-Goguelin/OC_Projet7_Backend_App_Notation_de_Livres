const perfectExpressSanitizer = require('perfect-express-sanitizer');

exports.sanitizer = perfectExpressSanitizer.clean({
	xss: true,
	noSql: true,
	sql: false,
	level: 5,
	// forbiddenTags: [ '.execute', '\'\'', '--', '<script>', 'ls -la', /\d=\d/gm ],
});