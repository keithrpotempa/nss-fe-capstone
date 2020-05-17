import React, { useEffect, useState } from "react";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import ApiManager from "../../../modules/ApiManager";
import CharacterSheetMunger from "./CharacterSheetMunger"

// This parent component (of all character sheet components) 
// gets some initial data necessary to render a character sheet, 
// and passes it on to the munger to organize and format

// It is used by the character sheet view (detail route)
// but not in the review stage of the character creation process

// TODO: possibly can be merged back with munger 
// now that skill list and stunt list have been lifted 

const CharacterSheet = props => {
  const skillList = props.skillList;
  const stuntList = props.stuntList;
  
  const [character, setCharacter] = useState({});
  const [characterSubType, setCharacterSubType] = useState({});
  const [characterAspects, setCharacterAspects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const activeUser = JSON.parse(sessionStorage.getItem("credentials"));
  const id = props.characterId;

  const getCharacter = () => {
    return ApiManager.get("characters", id)
      .then(character => {
        setCharacter(character)
        ApiManager.get("characterSubTypes", character.characterSubTypeId)
          .then(setCharacterSubType)
      });
  }

  const getCharacterAspects = () => {
    return ApiManager.getCharacterAttributes("characterAspects", id)
      .then(aspects => setCharacterAspects(ApiManager.arrayify(aspects)));
  }

  const handleDelete = (id) => {
    confirmAlert({
      title: 'Confirm to submit',
      message: 'Are you sure to delete this character?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => ApiManager.delete("characters", id)
            .then(props.history.push("/characters"))
        },
        {
          label: 'No',
          onClick: null
        }
      ]
    });
  }

  useEffect(()=>{
    getCharacter();
    getCharacterAspects();
    setIsLoading(false);
  }, [])

  return (
    <>
      <CharacterSheetMunger
        id={id}
        character={character}
        characterSubType={characterSubType}
        characterAspects={characterAspects}
        skillList={skillList}
        stuntList={stuntList}
        isLoading={isLoading}
        handleDelete={handleDelete}
        activeUser={activeUser}
      />
    </>
  )
}

export default CharacterSheet