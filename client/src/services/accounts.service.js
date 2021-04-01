import firebase from "../firebase";

const db = firebase.ref("/accounts");

class AccountService {
  getAll() {
    return db;
  }

  createAccount(uid, info) {
    return firebase.ref("/accounts/" + uid).set(info);
  }

  getAccountWithUid(uid) { 
    return db.child(uid).get();
  }

  getAccountWithAddress(address) { 
    return db.orderByChild('accountAddress').equalTo(address);
  }
/*
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