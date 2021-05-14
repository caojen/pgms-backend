const pbkdf2 = require('pbkdf2');

const hash = 'pbkdf2_sha256$36000$RyMIdWhTi3y7$roh+knYNRkNaZWKLrXudLDT+fGtDNnOjWvWBQlUOrl4=';
const plain = 'ta123456';

const parts = hash.split('$');
if(parts.length !== 4) {
  console.log('hash is plain');
  console.log(hash === plain);
}

const iteration = parseInt(parts[1]);
const salt = parts[2];

const password_hash = pbkdf2.pbkdf2Sync(plain, salt, iteration, 32, 'sha256').toString('base64');
if(password_hash === parts[3]) {
  console.log(true);
} else {
  console.log(false);
  console.log('salt:', salt);
  console.log('iteration:', iteration);
  console.log('expect:', password_hash);
  console.log('origin:', parts[3]);
}
