import app from "firebase/app";
import "firebase/auth";
import "firebase/database";

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_ID,
};

class Firebase {
  constructor() {
    app.initializeApp(config);

    this.serverValue = app.database.ServerValue;
    this.auth = app.auth();
    this.db = app.database();
  }

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = (email) => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = (password) =>
    this.auth.currentUser.updatePassword(password);

  // User files API
  getUserFiles = async (userId) => {
    const doc = await this.db.collection("users").doc(userId).get();

    if (doc.exists) {
      console.log("User found in database");
      const snapshot = await this.db
        .collection("users")
        .doc(doc.id)
        .collection("files")
        .get();

      let userFiles = [];
      snapshot.forEach((file) => {
        let { name, content } = file.data();
        userFiles.push({ id: file.id, name: name, content: content });
      });
      return userFiles;
    } else {
      console.log("User not found in database, creating new entry...");
      this.db.collection("users").doc(userId).set({});
      return [];
    }
  };

  createFile = async (userId, fileName) => {
    let res = await this.db
      .collection("users")
      .doc(userId)
      .collection("files")
      .add({
        name: fileName,
        content: "",
      });
    return res;
  };

  getFile = async (userId, fileId) => {
    const doc = await this.db
      .collection("users")
      .doc(userId)
      .collection("files")
      .doc(fileId)
      .get();

    return doc.data();
  };

  deleteFile = async (userId, fileId) => {
    let res = await this.db
      .collection("users")
      .doc(userId)
      .collection("files")
      .doc(fileId)
      .delete();
    return res;
  };

  onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        this.user(authUser.uid)
          .once("value")
          .then((snapshot) => {
            const dbUser = snapshot.val();

            if (!dbUser.roles) {
              dbUser.roles = {};
            }

            authUser = {
              uid: authUser.uid,
              email: authUser.email,
              ...dbUser,
            };

            next(authUser);
          });
      } else {
        fallback();
      }
    });
}

export default Firebase;
