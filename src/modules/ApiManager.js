const remoteURL = "http://localhost:5002";

export default {
  get(dataType, id) {
    return fetch(`${remoteURL}/${dataType}/${id}`)
      .then(result => result.json());
  },
  getAll(dataType) {
    return fetch(`${remoteURL}/${dataType}`)
      .then(result => result.json());
  },
  getAllExpand(dataType, expandType) {
    return fetch(`${remoteURL}/${dataType}?_expand=${expandType}`)
      .then(results => results.json())
  },
  search(dataType, query){
    return fetch(`${remoteURL}/${dataType}?q=${query}`)
      .then(results => results.json())
  },
  delete(dataType, id) {
    return fetch(`${remoteURL}/${dataType}/${id}`, {
      method: "DELETE"
    }).then(result => result.json());
  },
  post(dataType, objectToPost) {
    return fetch(`${remoteURL}/${dataType}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(objectToPost)
    }).then(data => data.json());
  },
  update(dataType, objectToEdit) {
    return fetch(`${remoteURL}/${dataType}/${objectToEdit.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(objectToEdit)
    }).then(data => data.json());
  }
};