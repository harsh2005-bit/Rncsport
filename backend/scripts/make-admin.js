const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../serviceAccountKey.json');
const serviceAccount = JSON.parse(fs.readFileSync(filePath, 'utf8'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function makeAdmin(email) {
  const usersRef = db.collection('users');
  const snapshot = await usersRef.where('email', '==', email).get();
  
  if (snapshot.empty) {
    console.log('No matching documents in users.');
    return;
  }  

  snapshot.forEach(async doc => {
    console.log(doc.id, '=>', doc.data());
    await usersRef.doc(doc.id).update({ role: 'ADMIN' });
    console.log(`Updated ${email} to ADMIN`);
  });
}

makeAdmin('harshjhabksc@gmail.com');
