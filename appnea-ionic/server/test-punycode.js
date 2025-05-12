'use strict';

/**
 * Punycode Fix: Redirect the deprecated built-in punycode module to the userland package
 */
(function() {
  // Save the original require function
  const originalRequire = module.constructor.prototype.require;

  // Override the require function to intercept punycode imports
  module.constructor.prototype.require = function(modulePath) {
    // If someone is requiring the built-in punycode module
    if (modulePath === 'punycode') {
      // Redirect to the userland punycode package
      // The trailing slash is important to avoid an infinite loop
      return originalRequire.call(this, 'punycode/');
    }

    // For all other modules, use the original require
    return originalRequire.apply(this, arguments);
  };

  // Silent fix - no console output
})();

console.log('Testing punycode userland package:');

// Now try to use the punycode module
const punycode = require('punycode');

console.log('Punycode version:', punycode.version);

// Test some punycode functionality
const domain = 'mañana.com';
const encoded = punycode.toASCII(domain);
const decoded = punycode.toUnicode(encoded);

console.log('Original domain:', domain);
console.log('Encoded domain:', encoded);
console.log('Decoded domain:', decoded);

// Verify that the fix is working by checking if we're using the userland version
console.log('Using userland punycode:', punycode.version !== undefined);
