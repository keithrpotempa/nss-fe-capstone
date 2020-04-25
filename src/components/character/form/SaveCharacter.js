import React from "react";
import { Button } from "semantic-ui-react";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import ApiManager from "../../../modules/ApiManager";
import firebase from '../../../firebase';

const SaveCharacter = props => {
  const character = props.character;
  const aspects = props.aspects;
  const skills = props.skills;
  const stunts = props.stunts;
  const isLoading = props.isLoading;
  const isEdit = props.match.params.characterId ? true : false;
  const setIsLoading= props.setIsLoading;

  // NOTE: JSON.parse is the reverse of JSON.stringify
  const user = JSON.parse(sessionStorage.getItem("credentials"));

  /* ------------ OBJECT CONSTRUCTORS ------------ */
  const constructCharacter = () => {
    const characterToSave = {
      name: character.name,
      characterSubTypeId: parseInt(character.subtype),
      userId: user.id,
      created: new Date().toLocaleString(),
      modified: new Date().toLocaleString()
    }
    if (isEdit) {
      characterToSave.id = parseInt(props.match.params.characterId);
      characterToSave.created = character.created
    }
    return characterToSave;
  }

  const constructAspect = (aspect, characterId) => {
    const aspectToSave = {
      name: aspect.name,
      characterId: characterId,
      aspectTypeId: aspect.aspectTypeId
    }
    return aspectToSave;
  }

  const constructSkill = (skill, rating, characterId) => {
    const skillToSave = {
      // NOTE: parseInt removed from these since Firebase uses alphanumeric keys
      characterId: characterId,
      skillId: skill,
      skillRating: rating
    }
    return skillToSave;
  }

  const constructStunt = (stuntId, characterId) => {
    const stuntToSave = {
      // NOTE: parseInt removed from these since Firebase uses alphanumeric keys
      characterId: characterId,
      stuntId: stuntId,
    }
    return stuntToSave;
  } 

  /* ------------ VALIDATIONS ------------ */
  // TODO: these are duplicated here and in MainForm

  // This should check that required fields are filled before allowing a submit
  const validChar = () => {
    const skillsAreEmpty = (characterSkills) => {
      const skillLevels = Object.values(characterSkills)
      const nonEmptySkillLevels = skillLevels.filter(skillLevel => skillLevel.length !== 0)
      if (nonEmptySkillLevels.length > 0) {
        return false;
      } else {
        return true;
      }
    }

    if (character.name === "") {
      validationConfirm("Enter a character name")
    } else if (aspects[0].name === "") {
      validationConfirm("Enter a High Concept aspect")
    } else if (skillsAreEmpty(skills)) {
      validationConfirm("Choose at least one skill")
    } else if (duplicateSkills().length > 0) {
      validationConfirm("You cannot have any duplicate skills")
    } else if (duplicateStunts().length > 0) {
      validationConfirm("You cannot have any duplicate stunts")
    } else {
      return true
    }
  }

  const validationConfirm = (message) => {
    confirmAlert({
      title: 'Required Field',
      message: message,
      buttons: [
        {
          label: 'Ok',
          onClick: null
        }
      ]
    });
  }

  const duplicateSkills = () => {
    const skillLevels = Object.values(skills)
    const nonEmptySkillLevels = skillLevels.filter(skillLevel => skillLevel.length !== 0)
    // Flatteing using the ES6 spread operator:
    // https://www.jstips.co/en/javascript/flattening-multidimensional-arrays-in-javascript/
    const allSkills = [].concat(...nonEmptySkillLevels);
    // Finding duplicates in an array:
    // https://stackoverflow.com/a/840808
    const sortedSkills = allSkills.slice().sort();
    let duplicates = [];
    for (let i = 0; i < sortedSkills.length - 1; i++) {
      if (sortedSkills[i+1] === sortedSkills[i]) {
        duplicates.push(sortedSkills[i]);
      }
    }
    return duplicates;
  }

  const duplicateStunts = () => {
    const stuntRows = Object.values(stunts)
    const nonEmptyStuntRows = stuntRows.filter(stuntRow => stuntRow.length !== 0)
    // Flatteing using the ES6 spread operator:
    // https://www.jstips.co/en/javascript/flattening-multidimensional-arrays-in-javascript/
    const allStunts = [].concat(...nonEmptyStuntRows);
    // Finding duplicates in an array:
    // https://stackoverflow.com/a/840808
    const sortedStunts = allStunts.slice().sort();
    let duplicates = [];
    for (let i = 0; i < sortedStunts.length - 1; i++) {
      if (sortedStunts[i+1] === sortedStunts[i]) {
        duplicates.push(sortedStunts[i]);
      }
    }
    return duplicates;
  }

  /* ------------ SAVING FUNCTIONS ------------ */
  // Made this an async function to allow it to have a .then after
  async function purge() {
    // IF edit, delete everything before starting
    // TODO: figure out a better way?
    if (isEdit) {
      const userId = props.match.params.characterId;
      return ApiManager.delete("characters", userId)
    } else {
      return character
    }
  }
  
  // [x] New for Firebase
  // https://stackoverflow.com/questions/38768576/in-firebase-when-using-push-how-do-i-get-the-unique-id-and-store-in-my-databas/38776788

  const saveCharacter = (char) => {
    if (isEdit) {
      // FIXME: TO BUILD
    } else {
      // If its not an edit, its a save
      // we need to get the id of the firebase reference
      const charRef = firebase.database().ref('characters').push(char);
      const id = charRef.key;
      char.id = id
    }
    return char
  }

  // [x] New for Firebase
  const saveAspects = (charId) => {
    aspects.forEach(aspect => {
      // This keeps blank aspects from being posted
      if (aspect.name !== "") {
        // Retrieving the firebase reference:
        const aspectsRef = firebase.database().ref('characterAspects')
        const aspectToSave = constructAspect(aspect, charId)
        // Pushing the new data to firebase:
        aspectsRef.push(aspectToSave)
        // The pre-firebase JSON method 
        // ApiManager.post("characterAspects", aspectToSave)
      } 
    })
  }

  // [x] New for Firebase
  const saveSkills = (charId) => {
    for (const row in skills) {
      const skillsAtRating = skills[row]
      const rating = row
      if (skillsAtRating.length > 0) {
        // Retrieving the firebase reference:
        skillsAtRating.forEach(skill => {
          const skillToSave = constructSkill(skill, rating, charId)
          const skillsRef = firebase.database().ref('characterSkills')
          // Pushing the new data to firebase:
          skillsRef.push(skillToSave)
          // The pre-firebase JSON method 
          // ApiManager.post("characterSkills", skillToSave)
        })
      }
    }
  }

  // [ ] New for Firebase
  const saveStunts = (charId) => {
    // Retrieving the firebase reference:
    const stuntsRef = firebase.database().ref('characterStunts')
    for (const row in stunts) {
      // Only build and post if there's 
      // actually a stunt selected on that row
      if (stunts[row]) {
        const stuntId = stunts[row]
        const stuntToSave = constructStunt(stuntId, charId)
        // Pushing the new data to firebase:
        stuntsRef.push(stuntToSave)
        // The pre-firebase JSON method
        // ApiManager.post("characterStunts", stuntToSave)
      }
    }  
  }


  /* ------------ SAVING ------------ */
  // FIREBASE APPROACH
  const handleSave = evt => {
    evt.preventDefault();
    // SAVING CHARACTER
    const char = constructCharacter()
    if (validChar(char)) {
      setIsLoading(true);
      // Save character to firebase
      // and store return key/id value for subsequent saves 
      const charId = saveCharacter(char).id;
      saveAspects(charId);
      saveSkills(charId);
      saveStunts(charId);
      props.history.push("/characters")
    }
  }

  /* JSON server approach:
  const handleSave = evt => {
    evt.preventDefault();
    // SAVING CHARACTER
    const char = constructCharacter()
    if (validChar(char)) {
      setIsLoading(true);
      purge()
        .then(resp => {
            // Not updating if everything is deleted
            ApiManager.post("characters", char)
              .then(resp => saveAspects(resp.id))
              .then(saveSkills)
              .then(saveStunts) 
              .then(() => props.history.push("/characters"))
        })
    }
  }
  */

  // useEffect(() => {}, [])

  return (
    <>
      <Button
        type="button"
        disabled={isLoading}
        onClick={(evt) => handleSave(evt)}
      >
        Save
      </Button>
    </>
  )
}

export default SaveCharacter;
