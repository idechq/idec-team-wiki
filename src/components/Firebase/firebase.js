import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

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

    /* Helper */

    this.fieldValue = app.firestore.FieldValue;
    this.emailAuthProvider = app.auth.EmailAuthProvider;

    /* Firebase APIs */

    this.auth = app.auth();
    this.db = app.firestore();

    /* Social Sign In Method Provider */

    this.googleProvider = new app.auth.GoogleAuthProvider();
    this.facebookProvider = new app.auth.FacebookAuthProvider();
    this.twitterProvider = new app.auth.TwitterAuthProvider();
  }

  // *** Auth API ***

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignInWithGoogle = () => this.auth.signInWithPopup(this.googleProvider);

  doSignInWithFacebook = () => this.auth.signInWithPopup(this.facebookProvider);

  doSignInWithTwitter = () => this.auth.signInWithPopup(this.twitterProvider);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = (email) => this.auth.sendPasswordResetEmail(email);

  doSendEmailVerification = () =>
    this.auth.currentUser.sendEmailVerification({
      url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT,
    });

  doPasswordUpdate = (password) =>
    this.auth.currentUser.updatePassword(password);

  // *** Merge Auth and DB User API *** //

  onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        this.user(authUser.uid)
          .get()
          .then((snapshot) => {
            const dbUser = snapshot.data();

            // default empty roles
            if (!dbUser.roles) {
              dbUser.roles = {};
            }

            // merge auth and db user
            authUser = {
              uid: authUser.uid,
              email: authUser.email,
              emailVerified: authUser.emailVerified,
              providerData: authUser.providerData,
              ...dbUser,
            };

            next(authUser);
          });
      } else {
        fallback();
      }
    });

  // *** User API ***

  user = (uid) => this.db.doc(`users/${uid}`);

  users = () => this.db.collection("users");

  // *** Message API ***

  message = (uid) => this.db.doc(`messages/${uid}`);

  messages = () => this.db.collection("messages");
  // User files API

  getUserFiles = async (userId) => {
    const doc = await this.db.collection("users").doc(userId).get();
    console.log(userId);
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
}

export default Firebase;
