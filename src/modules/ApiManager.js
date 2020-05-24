import firebase from '../firebase'

const fbUrl = "https://fate-character-codex.firebaseio.com";
const localURL = "http://localhost:5002"

export default {
  // ---------------- FIREBASE ----------------
  update(dataType, key, objectToPush) {
    // This method is used in combination with getKey to
    // 1) Get a reference (key) for a character-to-create
    // 2) Update that reference with the character

    // Reference:
    //https://firebase.google.com/docs/database/web/read-and-write#updating_or_deleting_data
    const updates = {}
    updates[`/${dataType}/${key}`] = objectToPush
    return firebase.database().ref().update(updates)
  },
  getKey(dataType){
    return firebase.database().ref().child(dataType).push().key
  },
  push(dataType, objectToPush) {
    return firebase.database().ref(`${dataType}/`).push(objectToPush)
    // It can be helpful to return the ref in order to get the key from it
    // https://stackoverflow.com/questions/38768576/in-firebase-when-using-push-how-do-i-get-the-unique-id-and-store-in-my-databas/38776788
  },
  getCharacterAttributes(characterAttribute, characterId) {
    return fetch(`${fbUrl}/${characterAttribute}/.json?orderBy="characterId"&equalTo="${characterId}"`)
      .then(result => result.json())
      .then(this.arrayify);
  },
  getHighConcept(characterId) {
    return fetch(`${fbUrl}/characterAspects/.json?orderBy="characterId"&equalTo="${characterId}"`)
      .then(result => result.json())
      .then(this.arrayify)
      .then(aspects => aspects.filter(aspect => aspect.aspectTypeId === 0)[0].name)
  },
  /* 
    Since Realtime Database data types are composed of array-like objects,
    while JSON server used arrays, this function had to be created to 
    convert those objects back into arrays in order to map them
  */
  arrayify(arrayLikeObject){
    let array = []

    Object.entries(arrayLikeObject).forEach(([key, value]) => {
      array.push(value)
    });

    return array
  },
  get(dataType, id) {
    return fetch(`${fbUrl}/${dataType}/${id}.json`)
      .then(result => result.json());
  },
  getAll(dataType) {
    return fetch(`${fbUrl}/${dataType}/.json`)
      .then(result => result.json());
  },
  // ---------------- JSON SERVER ----------------
  // TODO: Convert to Firebase approach
  getUserByEmail(email) {
    return fetch(`${localURL}/users?email=${email}`)
    .then(result => result.json());
  },
  // TODO: Convert to Firebase approach
  delete(dataType, id) {
    return fetch(`${fbUrl}/${dataType}/${id}`, {
      method: "DELETE"
    }).then(result => result.json());
  },
  // TODO: Convert to Firebase approach
  deleteByCharacterId(dataType, charId) {
    return fetch(`${fbUrl}/${dataType}?characterId=${charId}`, {
      method: "DELETE"
    }).then(result => result.json());
  },
  // TODO: Convert to Firebase approach
  post(dataType, objectToPost) {
    return fetch(`${fbUrl}/${dataType}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(objectToPost)
    }).then(data => data.json());
  },
    // TODO: Convert to Firebase approach
  update(dataType, objectToEdit) {
    return fetch(`${fbUrl}/${dataType}/${objectToEdit.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(objectToEdit)
    }).then(data => data.json());
  }
};
