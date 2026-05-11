const data = {
  name: 'TestUser2',
  email: 'testuser2@example.com',
  password: 'pass1234',
  role: 'USER',
};

fetch('http://localhost:3000/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data),
})
  .then(async (res) => {
    console.log('status', res.status);
    console.log(await res.text());
  })
  .catch((err) => {
    console.error('fetch error', err);
  });
