const API = "https://YOUR-BACKEND.onrender.com";

// FIREBASE CONFIG (ISI DARI FIREBASE)
const firebaseConfig = {
  apiKey: "ISI",
  authDomain: "ISI",
  projectId: "ISI"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

let currentUser;

// LOGIN
function login(){
  auth.signInWithEmailAndPassword(email.value, password.value);
}

// REGISTER
function register(){
  auth.createUserWithEmailAndPassword(email.value, password.value)
  .then(user=>{
    db.collection("users").doc(user.user.uid).set({
      saldo: 0
    });
  });
}

// AUTO LOGIN
auth.onAuthStateChanged(user=>{
  if(user){
    currentUser = user;
    document.getElementById("auth").style.display="none";
    document.getElementById("app").style.display="block";

    loadSaldo(user.uid);
  }
});

// SALDO REALTIME
function loadSaldo(uid){
  db.collection("users").doc(uid)
  .onSnapshot(doc=>{
    saldo.innerText = doc.data().saldo;
  });
}

// DEPOSIT QRIS
async function deposit(){
  let nominal = prompt("Masukkan nominal");

  let res = await fetch(API+"/deposit",{
    method:"POST",
    headers:{ "Content-Type":"application/json"},
    body: JSON.stringify({
      amount: nominal,
      uid: currentUser.uid
    })
  });

  let data = await res.json();
  window.open(data.data.qr_url);
}

// BELI PRODUK
async function beli(sku, harga){
  let target = document.getElementById("target").value;

  let userDoc = await db.collection("users").doc(currentUser.uid).get();
  let saldoUser = userDoc.data().saldo;

  if(saldoUser < harga){
    alert("Saldo tidak cukup");
    return;
  }

  // potong saldo
  await db.collection("users").doc(currentUser.uid).update({
    saldo: saldoUser - harga
  });

  // kirim order
  let res = await fetch(API+"/order",{
    method:"POST",
    headers:{ "Content-Type":"application/json"},
    body: JSON.stringify({
      buyer_sku_code: sku,
      customer_no: target,
      ref_id: "INV"+Date.now()
    })
  });

  let data = await res.json();
  alert(data.data.message);
}
