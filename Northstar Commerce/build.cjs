const fs = require('fs');
const path = require('path');

const files = [
  'js/utils/storage.js',
  'js/data/coupons.js',
  'js/data/products.js',
  'js/utils/helpers.js',
  'js/utils/toast.js',
  'js/store/cartStore.js',
  'js/store/wishlistStore.js',
  'js/store/productStore.js',
  'js/store/orderStore.js',
  'js/components/productCard.js',
  'js/components/drawerCart.js',
  'js/components/quickViewModal.js',
  'js/components/searchModal.js',
  'js/components/infoModal.js',
  'js/views/homeView.js',
  'js/views/shopView.js',
  'js/views/productView.js',
  'js/views/cartView.js',
  'js/views/wishlistView.js',
  'js/views/checkoutView.js',
  'js/views/accountView.js',
  'js/views/ordersView.js',
  'js/router.js',
  'js/app.js'
];

let bundleContent = '/* ==========================================================================\n   NORTHSTAR COMMERCE - Production Bundle\n   Compatible with file:// and http(s):// protocols\n   ========================================================================== */\n(function() {\n  "use strict";\n\n';

for (const file of files) {
  let code = fs.readFileSync(path.join(__dirname, file), 'utf8');
  // Remove import statements
  code = code.replace(/import\s+[\s\S]*?from\s+['\"][^'\"]+['\"];?/g, '');
  // Remove export keywords
  code = code.replace(/export\s+default\s+/g, '');
  code = code.replace(/export\s+(const|let|var|function|class)\s+/g, '$1 ');
  code = code.replace(/export\s*\{[^}]*\};?/g, '');
  
  bundleContent += `\n/* --- MODULE: ${file} --- */\n` + code + '\n';
}

bundleContent += '\n})();\n';

fs.writeFileSync(path.join(__dirname, 'js/bundle.js'), bundleContent, 'utf8');
console.log('Successfully created js/bundle.js! Size:', bundleContent.length, 'bytes');
