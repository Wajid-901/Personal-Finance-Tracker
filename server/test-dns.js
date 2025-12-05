const dns = require('dns');

console.log('Testing DNS resolution for smtp-relay.brevo.com...');

dns.lookup('smtp-relay.brevo.com', (err, address, family) => {
    if (err) {
        console.error('❌ DNS Lookup failed:', err);
    } else {
        console.log('✅ DNS Lookup success:');
        console.log('Address:', address);
        console.log('Family: IPv' + family);
    }
});

dns.resolve4('smtp-relay.brevo.com', (err, addresses) => {
    if (err) {
        console.error('❌ Resolve4 failed:', err);
    } else {
        console.log('✅ Resolve4 success:', addresses);
    }
});
