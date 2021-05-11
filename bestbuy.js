/* INCLUDES/REQUIREMENTS */
const request = require('request');
const rua = require('random-useragent');
const { exec } = require('child_process');

/* PROGRAM CONFIGURATION */

// Bestbuy product SKUs, seperated with a pipe character (|). Default SKU list consists of several RTX graphics cards
const skus =
  '15147122|15078017|15038016|15081879|15000079|15000078|15147703|15084753|14953249|14950588|14961449|14953248|14954116|15000077';
// Proxy to use (leave blank if none)
const proxy = '';
// Email address to notify
const email = '';
// Email message subject line
const emailSubject = 'Bestbuy item in stock!';
// Message to send, takes sku as function input and returns full message string
const alertMsg = (sku) =>
  `Bestbuy in-stock alert: item in stock https://www.bestbuy.ca/en-ca/search?search=${sku}`;

/* START OF PROGRAM */

request(
  {
    url:
      'https://www.bestbuy.ca/ecomm-api/availability/products?accept=application%2Fvnd.bestbuy.simpleproduct.v1%2Bjson&accept-language=en-CA&skus=' +
      skus,
    method: 'GET',
    headers: {
      'User-Agent': rua.getRandom()
    },
    proxy: proxy,
    timeout: 30000
  },
  function (error, response, body) {
    if (error) {
      console.error(error);
      return;
    }

    // Replace special characters that could trip up the JSON parsing method, and then parse the JSON
    const productData = JSON.parse(
      body
        .trim()
        .replace(/\\n/g, '\\n')
        .replace(/\\'/g, "\\'")
        .replace(/\\"/g, '\\"')
        .replace(/\\&/g, '\\&')
        .replace(/\\r/g, '\\r')
        .replace(/\\t/g, '\\t')
        .replace(/\\b/g, '\\b')
        .replace(/\\f/g, '\\f')
    );

    // Check for available items and notify for each
    if (productData.availabilities) {
      for (const availableProduct of productData.availabilities) {
        if (availableProduct.shipping.purchasable === true) {
          console.log(
            `Item in stock: ${availableProduct.sku} Purchasable: ${availableProduct.shipping.purchasable}`
          );
          // Use PHP to send an email
          exec(
            `php -r 'mail("${email}", "${emailSubject}", "${alertMsg(availableProduct.sku)}");'`,
            (error) => {
              if (error) {
                console.error(error);
              } else {
                console.log('User has been alerted about an in-stock Bestbuy item!');
              }
            }
          );
        }
      }
    }
  }
);
