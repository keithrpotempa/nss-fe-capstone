import firebase from '../firebase'

const jsonURL = "https://fate-character-codex.firebaseio.com";
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
  // UNUSED?
  // fbGetAll(dataType, setFunction) {
  //   const ref = firebase.database().ref(dataType)
  //   ref.once('value', (snapshot) => setFunction(snapshot.val()))
  // },
  // TODO: Convert to Firebase approach
  // ISSUES: I can't figure out how to do an expand with these firebase methods
  getCharacterAttributes(characterAttribute, characterId) {
    return fetch(`${jsonURL}/${characterAttribute}/.json?orderBy="characterId"&equalTo="${characterId}"`)
      .then(result => result.json());
  },
  getHighConcept(characterId) {
    return fetch(`${jsonURL}/characterAspects/.json?orderBy="characterId"&equalTo="${characterId}"`)
      .then(result => result.json())
      .then(this.arrayify)
      .then(aspects => aspects.filter(aspect => aspect.aspectTypeId === 0)[0].name)
  },
  arrayify(arrayLikeObject){
    let array = []

    Object.entries(arrayLikeObject).forEach(([key, value]) => {
      array.push(value)
    });

    return array
  },
  get(dataType, id) {
    return fetch(`${jsonURL}/${dataType}/${id}.json`)
      .then(result => result.json());
  },
  getAll(dataType) {
    return fetch(`${jsonURL}/${dataType}/.json`)
      .then(result => result.json());
  },
  // ---------------- JSON SERVER ----------------
  // TODO: Convert to Firebase approach
  // get(dataType, id) {
  //   return fetch(`${jsonURL}/${dataType}/${id}`)
  //     .then(result => result.json());
  // },
  // TODO: Convert to Firebase approach
  getCharacterWithType(id) {
    return fetch(`${jsonURL}/characters/${id}?_expand=characterSubType`)
      .then(result => result.json());
  },
  // DONE: Convert to Firebase approach
  // getAll(dataType) {
  //   return fetch(`${jsonURL}/${dataType}`)
  //     .then(result => result.json());
  // },
  // TODO: Convert to Firebase approach
  getUserByEmail(email) {
    return fetch(`${localURL}/users?email=${email}`)
    .then(result => result.json());
  },
  // TODO: Convert to Firebase approach
  getCharacterAspects(id){
    return fetch(`${jsonURL}/characterAspects?characterId=${id}`)
      .then(results => results.json());
  },
  // TODO: Convert to Firebase approach
  getCharacterSkills(id){
    return fetch(`${jsonURL}/characterSkills?characterId=${id}&_expand=skill`)
      .then(results => results.json());
  },
  // TODO: Convert to Firebase approach
  getCharacterStunts(id) {
    return fetch(`${jsonURL}/characterStunts?characterId=${id}&_expand=stunt`)
      .then(results => results.json())
  },
  // TODO: Convert to Firebase approach
  getCharacterList() {
    return fetch(`${jsonURL}/characters?_embed=characterAspects&_expand=user&_expand=characterSubType`)
      .then(results => results.json())
  },
  // TODO: Convert to Firebase approach
  getAllSubTypesWithDetails() {
    return fetch(`${jsonURL}/characterSubTypes/?_expand=characterType`)
      .then(results => results.json())
  },
  // TODO: Convert to Firebase approach
  getSubTypeDetails(id) {
    return fetch(`${jsonURL}/characterSubTypes/${id}?_expand=characterType`)
      .then(results => results.json())
  },
  // TODO: Convert to Firebase approach
  getAllExpand(dataType, expandType) {
    return fetch(`${jsonURL}/${dataType}?_expand=${expandType}`)
      .then(results => results.json())
  },
  // TODO: Convert to Firebase approach
  // getAllEmbed(dataType, embedType) {
  //   return fetch(`${jsonURL}/${dataType}?_embed=${embedType}`)
  //     .then(results => results.json())
  // },
  // TODO: Convert to Firebase approach
  search(dataType, query){
    return fetch(`${jsonURL}/${dataType}?q=${query}`)
      .then(results => results.json())
  },
  // TODO: Convert to Firebase approach
  delete(dataType, id) {
    return fetch(`${jsonURL}/${dataType}/${id}`, {
      method: "DELETE"
    }).then(result => result.json());
  },
  // TODO: Convert to Firebase approach
  deleteByCharacterId(dataType, charId) {
    return fetch(`${jsonURL}/${dataType}?characterId=${charId}`, {
      method: "DELETE"
    }).then(result => result.json());
  },
  // TODO: Convert to Firebase approach
  post(dataType, objectToPost) {
    return fetch(`${jsonURL}/${dataType}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(objectToPost)
    }).then(data => data.json());
  },
    // TODO: Convert to Firebase approach
  // update(dataType, objectToEdit) {
  //   return fetch(`${jsonURL}/${dataType}/${objectToEdit.id}`, {
  //     method: "PUT",
  //     headers: {
  //       "Content-Type": "application/json"
  //     },
  //     body: JSON.stringify(objectToEdit)
  //   }).then(data => data.json());
  // }
};
