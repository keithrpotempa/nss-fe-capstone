import React, { useEffect } from "react";
import ApiManager from "../../../modules/ApiManager";

/*
  This component is only rendered on the MainForm 
  if a character is being edited.
  
  It retrieves all of that character's data from the
  database and puts it in state in the format of the form
*/

const EditCharacter = props => {
  const characterSubTypeList = props.characterSubTypeList;

  const characterId = props.characterId;
  const setCharacter = props.setCharacter;
  const setCharacterSubTypeDetails = props.setCharacterSubTypeDetails;

  const characterAspects = props.characterAspects;
  const setCharacterAspects = props.setCharacterAspects;
  
  const characterSkills = props.characterSkills;
  const setCharacterSkills = props.setCharacterSkills;
  
  const characterStunts = props.characterStunts;
  const setCharacterStunts = props.setCharacterStunts;
  
  const setIsLoading = props.setIsLoading;

  const editSetup = () => {
    ApiManager.get("characters", characterId)
      .then(setCharacterToEdit)
    ApiManager.getCharacterAttributes("characterAspects", characterId)
      .then(setAspectsToEdit)
    ApiManager.getCharacterAttributes("characterSkills", characterId)
      .then(setSkillsToEdit)
    ApiManager.getCharacterAttributes("characterStunts", characterId)
      .then(setStuntsToEdit)
      .then(() => setIsLoading(false))
  }
  
  const setCharacterToEdit = (character) => {
    const subtypeId = character.characterSubTypeId;
    let typeId = 0
    if (characterSubTypeList.length > 0) {
      // Subtype variable is the whole subtype object:
      const subtype = characterSubTypeList
        // Filtering the subtype list to get 
        // the correct subtype by the id on the character
        .filter(subType => subType.id === subtypeId)[0]
      // Associated typeId is retrieved from the subtype object
      typeId = subtype.characterTypeId
      // And set in state
      setCharacterSubTypeDetails(subtype);
    }
    // TODO: I don't like that the type and subtype are strings...
    // Fix this elsewhere so they don't have to be
    const characterToEdit = {
      name: character.name, 
      type: `${typeId}`, 
      subtype: `${subtypeId}`,
      created: character.created,
      id: characterId
    }
    setCharacter(characterToEdit);

  }
  
  const setAspectsToEdit = (aspects) => {
    if (aspects.length > 0) {
      const stateToChange = [...characterAspects];
      // TODO: Make this loop more adaptable to different range of rating levels
      for (let i = 0; i < 7; i++) {
        const aspect = aspects[i]
        if (aspect) {
          stateToChange[i] = {name: aspect.name, aspectTypeId: aspect.aspectTypeId}
        }
      } 
      setCharacterAspects(stateToChange)
    }
  }

  const setSkillsToEdit = (skills) => {
    const stateToChange = {...characterSkills};
    // TODO: Make this loop more adaptable to different range of rating levels
    for (let i = 1; i < 7; i++) {
      stateToChange[i] = skillsByRating(skills, i)
    } 
    setCharacterSkills(stateToChange)
  }

  const setStuntsToEdit = (stunts) => {
    const stateToChange = {...characterStunts};
    // TODO: Make this loop more adaptable to different range of stunt numbers
    stunts.forEach(function(stunt, index) {
      if (stunt.stuntId !== "0") {
        return stateToChange[ index + 1] = stunt.stuntId.toString();       
      }
    }) 
    setCharacterStunts(stateToChange)
  }

  const skillsByRating = (skills, rating) => {
    // Converting the format of the db to the format of the form's state
    const filteredSkills = skills.filter(skill => skill.skillRating === rating)
    const formattedSkills = filteredSkills.map(skill => skill.skillId.toString())
    return formattedSkills;
  }

  useEffect(() => {
    editSetup();
  }, [characterSubTypeList])

  return (
    <>
    </>
  )
}

export default EditCharacter;