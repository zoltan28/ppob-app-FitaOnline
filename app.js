const API = "https://ppob-backend-production.up.railway.app";

// FIREBASE CONFIG (ISI PUNYA KAMU)
const firebaseConfig = {
  apiKey: "AIzaSyAaEWDrk8yYGaOmZISFuK9Vr9kvdsiN_ho",
  authDomain: "ppob-app-5c3f2.firebaseapp.com",
  projectId: "ppob-app-5c3f2"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// ELEMENT
let email = document.getElementById("email");
let password = document.getElementById("password");
let saldo = document.getElementById("saldo");
let authDiv = document.getElementById("auth");
let app = document.getElementById("app");

let currentUser;

// REGISTER
function register(){
  auth.createUserWithEmailAndPassword(email.value, password.value)
  .then(user=>{
    db.collection("users").doc(user.user.uid).set({
      saldo: 0
    });
    alert("Register berhasil");
  }).catch(e=>alert(e.message));
}

// LOGIN
function login(){
  auth.signInWithEmailAndPassword(email.value, password.value)
  .then(()=>alert("Login berhasil"))
  .catch(e=>alert(e.message));
}

// AUTO LOGIN
auth.onAuthStateChanged(user=>{
  if(user){
    currentUser = user;
    authDiv.style.display="none";
    app.style.display="block";

    db.collection("users").doc(user.uid)
    .onSnapshot(doc=>{
      saldo.innerText = doc.data().saldo;
    });
  }
});

// DEPOSIT (TEST DULU)
async function deposit(){
  let nominal = prompt("Masukkan saldo:");

  if(!nominal) return;

  alert("Simulasi: saldo bertambah");

  // TAMBAH SALDO LANGSUNG (TEST)
  let userRef = db.collection("users").doc(currentUser.uid);
  let userDoc = await userRef.get();

  await userRef.update({
    saldo: userDoc.data().saldo + parseInt(nominal)
  });
}

// BELI
async function beli(){
  let target = document.getElementById("target").value;

  if(!target){
    alert("Masukkan nomor!");
    return;
  }

  let userRef = db.collection("users").doc(currentUser.uid);
  let userDoc = await userRef.get();

  let saldoUser = userDoc.data().saldo;

  if(saldoUser < 10000){
    alert("Saldo tidak cukup");
    return;
  }

  // POTONG SALDO
  await userRef.update({
    saldo: saldoUser - 10000
  });

  // SIMULASI ORDER
  alert("Order berhasil (simulasi)");
}
