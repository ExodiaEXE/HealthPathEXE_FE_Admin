const potrace = require('potrace');
const fs = require('fs');

potrace.trace('public/logo2.png', { color: '#93B18F' }, function(err, svg) {
  if (err) throw err;
  fs.writeFileSync('public/logo2.svg', svg);
  console.log("SVG created");
});
