# Shopify Theme Protector 🛡️

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D14-brightgreen.svg)](https://nodejs.org)

A lightweight, automated Node.js tool for Shopify Theme Developers to protect their themes from unauthorized use and piracy. 

## How it works

Because Shopify provides an easy "Download theme file" button to all merchants, it is impossible to prevent a user from exporting a `.zip` file of your theme. 

This tool protects your intellectual property by **locking the theme to a specific Shopify domain**. It generates a JavaScript payload that checks the `window.Shopify.shop` variable. It then uses `javascript-obfuscator` to scramble the payload and encrypt the domain string (via Base64 and RC4) so pirates cannot simply `CTRL + F` search for the domain and replace it. Finally, it injects this unreadable security lock into your theme's core JS file.

If a user exports the theme and installs it on a different store, the theme will destroy the page layout and redirect them.

## Requirements
- Node.js installed on your machine.
- A Shopify theme with a primary JavaScript asset (e.g., `theme.js` or `global.js`).

## Installation

1. Navigate to this folder in your terminal:
   ```bash
   cd theme-protector
   ```
2. Install the required obfuscator package:
   ```bash
   npm install
   ```

## Usage

Run the `protect.js` script passing two arguments:
1. The authorized client's Shopify domain (must be the `.myshopify.com` domain).
2. The relative path to the theme's core JavaScript file.

**Command:**
```bash
node protect.js <client-domain.myshopify.com> <path-to-theme-js-file>
```

**Example:**
```bash
node protect.js myclient.myshopify.com ../kartshift-theme/assets/theme.js
```

### Pro-Tip for Maximum Security 💡
Do not create a file called `license.js` or `security.js` to hold this code. A pirate will simply delete that file. Always inject the protection into a **critical** file that the theme needs to function properly (like the file that controls the Add to Cart button). If they try to delete the obfuscated block, they risk breaking the entire file.

## Disclaimer
No front-end code is 100% un-hackable, but this adds a significant layer of friction that will stop 99% of casual theme sharing and piracy. For enterprise-level protection, consider moving core theme logic into a custom Shopify App using Theme App Extensions.
