// Node 20 has native fetch


const BASE_URL = 'http://localhost:5000/api';
let token = '';
let userId = '';

async function testAuth() {
    console.log('--- Testing Authentication ---');

    // 1. Register
    const uniqueEmail = `test${Date.now()}@example.com`;
    console.log(`Registering user with email: ${uniqueEmail}`);
    try {
        const registerRes = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test User',
                email: uniqueEmail,
                password: 'password123'
            })
        });
        const registerData = await registerRes.json();
        console.log('Register Status:', registerRes.status);
        if (registerRes.status !== 201 && registerRes.status !== 200) {
            console.error('Register Failed:', registerData);
            return;
        }
        console.log('Register Success');

        // 2. Login
        console.log('Logging in...');
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: uniqueEmail,
                password: 'password123'
            })
        });
        const loginData = await loginRes.json();
        console.log('Login Status:', loginRes.status);
        
        if (loginRes.status === 200) {
            token = loginData.token;
            console.log('Login Success, Token received');
        } else {
            console.error('Login Failed:', loginData);
            return;
        }

        // 3. Get Profile
        console.log('Getting Profile...');
        const profileRes = await fetch(`${BASE_URL}/auth/me`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const profileData = await profileRes.json();
        console.log('Get Profile Status:', profileRes.status);
        if (profileRes.status === 200) {
            console.log('Get Profile Success:', profileData.email);
            userId = profileData._id;
        } else {
            console.error('Get Profile Failed:', profileData);
        }

        // 4. Create Transaction
        console.log('Creating Transaction...');
        const transactionRes = await fetch(`${BASE_URL}/transactions`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                type: 'income',
                amountCents: 500000, // $5000.00
                note: 'Test Salary',
                dateIso: new Date().toISOString()
            })
        });
        const transactionData = await transactionRes.json();
        console.log('Create Transaction Status:', transactionRes.status);
        if (transactionRes.status === 201) {
            console.log('Create Transaction Success:', transactionData.note);
        } else {
            console.error('Create Transaction Failed:', transactionData);
        }

        // 5. Get Transactions
        console.log('Getting Transactions...');
        const getTransRes = await fetch(`${BASE_URL}/transactions`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const getTransData = await getTransRes.json();
        console.log('Get Transactions Status:', getTransRes.status);
        if (getTransRes.status === 200) {
            console.log('Get Transactions Success, Count:', getTransData.length);
            if (getTransData.length > 0) {
                const transId = getTransData[0]._id;
                
                // 6. Delete Transaction
                console.log(`Deleting Transaction ${transId}...`);
                const deleteRes = await fetch(`${BASE_URL}/transactions/${transId}`, {
                    method: 'DELETE',
                    headers: { 
                        'Authorization': `Bearer ${token}`
                    }
                });
                const deleteData = await deleteRes.json();
                console.log('Delete Transaction Status:', deleteRes.status);
                if (deleteRes.status === 200) {
                    console.log('Delete Transaction Success');
                } else {
                    console.error('Delete Transaction Failed:', deleteData);
                }
            }
        } else {
            console.error('Get Transactions Failed:', getTransData);
        }

    } catch (error) {
        console.error('Test Error:', error);
    }
}

async function runTests() {
    await testAuth();
}

runTests();
