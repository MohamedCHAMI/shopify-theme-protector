const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');

const args = process.argv.slice(2);

if (args.length < 2) {
    console.log("Usage: node protect.js <store-domain.myshopify.com> <path-to-theme-js-file>");
    console.log("Example: node protect.js myclient.myshopify.com ../kartshift-theme/assets/theme.js");
    process.exit(1);
}

const authorizedDomain = args[0];
const targetFilePath = path.resolve(args[1]);

if (!fs.existsSync(targetFilePath)) {
    console.error(`Error: File not found at ${targetFilePath}`);
    process.exit(1);
}

console.log(`🔒 Generating protection for: ${authorizedDomain}`);

// The raw security check code
const securityCode = `
// [THEME SECURITY LOCK]
(function() {
    document.addEventListener("DOMContentLoaded", function() {
        var authorizedStore = "${authorizedDomain}"; 
        var currentStore = window.Shopify ? window.Shopify.shop : window.location.hostname;
        
        if (currentStore !== authorizedStore) {
            document.body.innerHTML = "<div style='font-family:sans-serif; text-align:center; padding: 100px; margin-top: 50px;'><h1>⚠️ Unauthorized Theme Usage</h1><p>This theme is not licensed for this Shopify store. Please purchase a valid license.</p></div>";
            setTimeout(function() {
                window.location.href = "https://shopify.com";
            }, 3000);
        }
    });
})();
`;

console.log("🌪️  Obfuscating and encoding strings...");
const obfuscationResult = JavaScriptObfuscator.obfuscate(securityCode, {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 1,
    numbersToExpressions: true,
    simplify: true,
    stringArray: true,
    stringArrayEncoding: ['base64', 'rc4'],
    stringArrayThreshold: 1,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 0.4
});

const obfuscatedCode = obfuscationResult.getObfuscatedCode();

console.log(`Injecting protected code into ${args[1]}...`);

// Read existing file
let existingCode = fs.readFileSync(targetFilePath, 'utf8');

// Append the obfuscated code
const updatedCode = existingCode + "\n\n" + obfuscatedCode;

fs.writeFileSync(targetFilePath, updatedCode, 'utf8');

console.log("✅ Success! The theme file has been locked to " + authorizedDomain);
console.log("Note: Do not run this on the same file twice. Make sure to test it on the store!");
