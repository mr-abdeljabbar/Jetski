const API_URL = 'http://localhost:3001/api';
const BOOKING_ID = 'ef58e00c-e14e-4778-b235-6ece8eb0f8c2';

async function verify() {
  try {
    console.log('Logging in as Admin...');
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@taghazoutjet.com',
        password: 'admin123'
      })
    });
    
    if (!loginRes.ok) {
      const err = await loginRes.json();
      throw new Error(`Login failed: ${err.error}`);
    }

    const { token } = await loginRes.json();
    console.log('Login successful. Token obtained.');

    console.log(`Attempting to update status for booking ${BOOKING_ID} as Admin...`);
    const patchRes = await fetch(`${API_URL}/bookings/${BOOKING_ID}/status`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ status: 'confirmed' })
    });

    if (!patchRes.ok) {
      const err = await patchRes.json();
      throw new Error(`PATCH failed: ${err.error || patchRes.statusText}`);
    }

    const updatedBooking = await patchRes.json();
    console.log('SUCCESS! Status updated:', updatedBooking.status);
  } catch (error) {
    console.error('FAILED!', error.message);
  }
}

verify();
