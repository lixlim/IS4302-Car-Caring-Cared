import firebase from "../firebase";

const db = firebase.ref("/accounts");

class AccountService {
  getAll() {
    return db;
  }

  createAccount(uid, info) {
    return firebase.ref("/accounts/" + uid).set(info);
  }

/*
  get(key) { 
    // key = userID
    return db.on(key, function(snapshot) {
      snapshot.val();
   });
  }


  update(key, value) {
    return db.child(key).update(value);
  }

  delete(key) {
    return db.child(key).remove();
  }

  deleteAll() {
    return db.remove();
  }
  */
}

export default new AccountService();