const pbkdf2 = require('pbkdf2');

const plain_text = 'ppggmmss13331270';

const salt_char_set = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const salt_len = 12;

const iteration = 10000;

// generate salt:
let salt = '';
for (let i = 0; i < salt_len; i++) {
  const index = Math.random() * salt_len;
  salt += salt_char_set.charAt(index);
}

const hash = pbkdf2.pbkdf2Sync(plain_text, salt, iteration, 32, 'sha256').toString('base64');
const output = `pbkdf2_sha256$${iteration}$${salt}$${hash}`;

console.log(output);
