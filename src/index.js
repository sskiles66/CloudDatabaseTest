import {initializeApp} from 'firebase/app';
import {getAuth, onAuthStateChanged} from 'firebase/auth';
import {getFirestore, doc, setDoc, collection, addDoc, getDoc, onSnapshot, query, where, limit, getDocs, querySnapshot, updateDoc, deleteDoc} from 'firebase/firestore';

//had to install webpack to bundle and then serve /main.js

const firebaseApp = initializeApp({
  apiKey: "AIzaSyBkqPNQCK-qmRZ-tWq00BtV31qiZuUz26I",
  authDomain: "test-517d7.firebaseapp.com",
  projectId: "test-517d7",
  storageBucket: "test-517d7.appspot.com",
  messagingSenderId: "275210816798",
  appId: "1:275210816798:web:3c9a7385fc86b4157c8d0f",
  measurementId: "G-MYXNGQZY6R"
});

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

const specialOfDay = doc(db, 'dailySpecial/2021-09-14');

function writeDailySpecial() {
  const docData = {
    description: "Vanilla Latte",
    price: 3.99,
    milk: "Whole"
  };

  setDoc(specialOfDay, docData);

}


console.log("test");

onAuthStateChanged(auth, user => {
  if (user != null){
    console.log("logged in");
  }else{
    console.log("No user");
  }
});

const ordersCollection = collection(db, 'orders');

const peopleCollection = collection(db, 'people');

const peopleCollection2 = collection(db, 'people2');



async function addANewDocument(){
  const newDoc = await addDoc(ordersCollection, {
    customer: 'bd',
    drink: "Latte",
    cost: 5.99
  } );
}

async function addANewDocumentPeople(fname, lname){
  const newDoc = await addDoc(peopleCollection2, {
    fname: `${fname}`,
    lname: `${lname}`
    
  } );
  queryForDocuments();
  console.log("success");
}

async function readASingleDocument(){
  const mySnapshot = await getDoc(specialOfDay);
  if (mySnapshot.exists()){
    const docData = mySnapshot.data();
    console.log( `My data is ${JSON.stringify(docData)}`);
  }
}

function listenToADocument(){
  onSnapshot(specialOfDay, (docSnapshot) => {
    if (docSnapshot.exists()){
      const docData = docSnapshot.data();
      console.log( `In real time, doc data is ${JSON.stringify(docData)}`);
      document.querySelector("#special").innerHTML = JSON.stringify(docData);
    }
  } )
  
}

async function queryForDocuments(){
  const customerOrdersQuery = query(
    collection(db, 'people2'),
    //where('drink', '==', 'Latte'),
    //limit(100)
  );

  document.querySelector("#people").replaceChildren();

  const cancel = onSnapshot(customerOrdersQuery, (querySnapshot) => {
    querySnapshot.forEach((snap) => {
      console.log(` Real time ${snap.id} contains ${JSON.stringify(snap.data())}`);
      
      const li = document.createElement('li');
      li.innerHTML = `Document ${snap.id} contains ${JSON.stringify(snap.data())}`;
      document.querySelector("#people").appendChild(li);
    });
  });

  const querySnapshot = await getDocs(customerOrdersQuery);
  querySnapshot.forEach(snap => {
  console.log( `Document ${snap.id} contains ${JSON.stringify(snap.data())}`);
  
  });
}

function helper(){
  document.querySelector("#people").replaceChildren();
  let fname = document.querySelector("#fname").value;
  let lname = document.querySelector("#lname").value;
  addANewDocumentPeople(fname, lname);

}



//let name = document.querySelector("#submit").value;

document.querySelector("#name-submit").addEventListener('click', helper);



async function updateDocument(){
  let key = document.querySelector("#updateKey").value;
  const personRef = doc(db, "people2", `${key}`);
  let fname = document.querySelector("#fname").value;
  let lname = document.querySelector("#lname").value;
  await updateDoc(personRef, {
    fname: `${fname}`,
    lname: `${lname}`
  });
  //document.querySelector("#people").replaceChildren();
  queryForDocuments();
}

async function deleteDocument(){
  let key = document.querySelector("#updateKey").value;
  const personRef = doc(db, "people2", `${key}`);
  await deleteDoc(personRef);
  //document.querySelector("#people").replaceChildren();
  queryForDocuments();
}

document.querySelector("#update").addEventListener('click', updateDocument);

document.querySelector("#delete").addEventListener('click', deleteDocument);

document.querySelector("#view").addEventListener('click', queryForDocuments);

//writeDailySpecial();
//node_modules/.bin/webpack
//addANewDocument();


//readASingleDocument();
listenToADocument();
//queryForDocuments();

