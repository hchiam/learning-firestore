# Learning Google Firebase **_Firestore_**

Just one of the things I'm learning. <https://github.com/hchiam/learning>

Based on this tutorial: <https://codeartistry.io/the-firestore-2020-tutorial>

Firestore = DB != Firebase DB.

Realtime. NoSQL (= on big JS object, no schema). Scalable.

Collections -> Documents -> Fields -> KVP

Collections -> [Documents {id:doc}] -> Fields {key:value}

```js
// pseudo-code showing conceptual layout:
[
  {
    docId: { key: value },
  },
  {
    docId: {
      key: value,
      key: value,
    },
  },
  {
    docId: { key: value, key: value, key: value },
  },
  {
    docId: { id: "s0m3L0ngA1ph4Num3r1c5tr1ng", title: "some book title" },
  },
];
```

## Summary of helpful functions to get/set data

- `.get().then()` = "await get x1"
- `.onSnapshot()` = "listen current"
- `unsubscribe() = (what's returned by the snapshot call)` = "stop listening"
- `.doc().get().then()` = "get 1 doc"
- `.add().then()` = "add doc to collection"
- `.set().then()` = "completely replace (or create) doc in collection" (but can `.set({...},{merge:true})`)
- `.update().then().catch()` = "update doc field(s)"
- `.delete().then().catch()` = "delete doc" (deleting collections is _not_ recommended)
- `.collection().doc().collection()` or `.collection('.../.../...)` = sub-collection
- `firebase.firestore.FieldValue.serverTimestamp()`
- `firebase.firestore.FieldValue.increment(1)`
- `.where('count', '>=', 1)`
- `.limit(3)`
- `.orderBy('created', 'desc')`

## Quick example

```bash
git clone https://github.com/hchiam/learning-firestore.git
cd learning-firestore/test-firebase
yarn # or npm install
```

create a `.env` file: (it'll automatically be used to fill in necessary data in `var firebaseConfig` via `process.env.[...]`)

```text
apiKey=
authDomain=
databaseURL=
projectId=your-project-id-here-is-all-you-need
storageBucket=
messagingSenderId=
```

and then run this:

```bash
node firebase.js
```

## Setup

1. <https://firebase.google.com/>
2. console
3. create project
4. project dashboard -> code button
5. `npm install firebase` or `yarn add firebase`
6. commonjs / node / server:

   ```js
   const firebase = require("firebase/app");
   require("firebase/firestore");
   ```

   or with ES Modules / client:

   ```js
   import firebase from "firebase/app";
   import "firebase/firestore";
   ```

   but either way, to initialize Firebase:

   ```js
   var firebaseConfig = {
     // get this info from Project Overview --> Project settings
     apiKey: "L0ngA1ph4Num3r1c5tr1ng",
     authDomain: "projectid.firebaseapp.com",
     databaseURL: "https://projectid.firebaseio.com",
     projectId: "projectid",
     storageBucket: "projectid.appspot.com",
     messagingSenderId: "0123456789", // project number?
     appId: "1:01234567990:web:123abc456def789",
   };

   firebase.initializeApp(firebaseConfig);
   ```

7. console -> 'Database' tab -> create database (or 'Cloud Firestore' tab --> create database)
8. For testing only, start in test mode and enable all reads and writes.
9. start a collection (and enter required info and a first document in the collection)
   - To actually create a sub-collection, you have to create at least 1 doc in it.

I might have a tiny bit of [React](https://github.com/hchiam/learning-reactjs) in this repo, but it's only used as an example. You can see another example in a repo with [Vue + Firebase](https://github.com/hchiam/vuejsfirebase/blob/master/src/App.vue).

```jsx
const db = firebase.firestore();
const collection = db.collection("books");
const doc = collection("s0m3L0ngA1ph4Num3r1c5tr1ng");

collection.get().then((snapshot) => {
  const collectionData = snapshot.docs.map((doc) => ({
    // docs = [doc]; doc = {id, data()}
    id: doc.id,
    ...doc.data(),
  }));
});

const unsubscribe = collection.onSnapshot((snapshot) => {
  const collectionData = snapshot.docs.map((doc) => ({
    // docs = [doc]; doc = {id, data()}
    id: doc.id,
    ...doc.data(),
  }));
});

// But how would you use unsubscribe()? The function returned inside useEffect is called upon "onDestroy":

function App() {
  const [books, setBooks] = useState([]); // init to empty array

  useEffect(() => {
    const unsubscribe = firebase
      .firestore() // db
      .collection("books") // collection
      .onSnapshot((snapshot) => {
        const collectionData = snapshot.docs.map((doc) => ({
          // docs = [doc]; doc = {id, data()}
          id: doc.id,
          ...doc.data(),
        }));
      });

    setBooks(data);

    return unsubscribe; // called upon "onDestroy" because is returned inside useEffect
  }, []);

  return books.map((book) => <BookList key={book.id} book={book} />);
}

const doc = collection.doc("s0m3L0ngA1ph4Num3r1c5tr1ng");
doc.get().then((doc) => {
  // doc: {exists, data()}
  if (!doc.exists) return;
  console.log("Doc data:", doc.data());
});

collection
  .add({
    title: "Another book to add",
  })
  .then((ref) => {
    console.log("New doc id:", ref.id);
    // note: canNOT use this ref to directly get data,
    // but CAN pass ref to doc() to create another query
  });

doc
  .set({
    title: "Updated title", // completely replaces the original doc
  })
  .then(() => {
    console.log("doc was created or completely replaced");
  });

// but to MERGE data instead:

doc
  .set(
    { author: "AuthorToMerge IntoExistingDoc" },
    {
      merge: true,
    }
  )
  .then(() => {
    console.log("doc data merged into existing doc");

    doc.get().then((d) => {
      console.log("merged doc data:", d.data());
    });
  });

doc
  .update({
    year: 1869,
  })
  .then(() => {
    console.log("updated the doc");
  })
  .catch((error) => {
    console.log(error);
  });

doc
  .delete()
  .then(() => {
    console.log("deleted the doc");
  })
  .catch((error) => {
    console.log(error);
  });

const retrievedSubCollection = collection("users")
  .doc("user-id")
  .collection("books");
const retrievedSubCollection = db.collection("users/user-id/books");
// .../.../... must be odd; collection/id/collection; collection must be last

// to actually create a (sub-)collection, you have to create at least 1 doc in it:
firebase
  .firestore()
  .collection("users/user-id/books") // sub-collection
  .add({
    //
    title: "East of eden",
  });

doc
  .set({
    created: firebase.firestore.FieldValue.serverTimestamp(),
  })
  .then(() => {
    console.log("set doc");
  });

doc
  .set({
    count: firebase.firestore.FieldValue.increment(1),
  })
  .then(() => {
    console.log("set doc");

    doc.get().then((d) => {
      console.log("updated data:", d.data());
    });
  });

collection
  .where("count", ">=", 1) // note: you can chain multiple .where() methods
  .get()
  .then((querySnapshot) => {
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("users with > 1 book:", data);
  });

collection.where("count", ">=", 1).limit(3);
collection.where("count", ">=", 1).orderBy("created", "desc").limit(3);
// note: remember to call .orderBy() BEFORE calling .limit()
```

## Further learning

Firebase auth:

- General intro: <https://firebase.google.com/docs/auth>
- Easy basic web auth: <https://firebase.google.com/docs/auth/web/firebaseui>
