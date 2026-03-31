const API = "https://ppob-backend-production.up.railway.app";

// FIREBASE CONFIG (ISI PUNYA KAMU)
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
    authDiv.style.display="none";
    app.style.display="block";
    loadSaldo(user.uid);
  }
});

// SALDO
function loadSaldo(uid){
  db.collection("users").doc(uid)
  .onSnapshot(doc=>{
    saldo.innerText = doc.data().saldo;
  });
}

// DEPOSIT
async function deposit(){
  let nominal = prompt("Isi saldo:");

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

// BELI
async function beli(sku, harga){
  let target = document.getElementById("target").value;

  let userDoc = await db.collection("users").doc(currentUser.uid).get();
  let saldoUser = userDoc.data().saldo;

  if(saldoUser < harga){
    alert("Saldo tidak cukup");
    return;
  }

  await db.collection("users").doc(currentUser.uid).update({
    saldo: saldoUser - harga
  });

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
