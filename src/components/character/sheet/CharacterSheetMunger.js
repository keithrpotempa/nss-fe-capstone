import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Button, Icon} from "semantic-ui-react"
import ApiManager from "../../../modules/ApiManager";
import CharacterMeta from "./CharacterMeta";
import SheetPreview from "./SheetPreview";

// This component is a child of CharacterSheet,
// it retrieves characterSkills and characterStunts data
// and munges them into the proper format 
// to hand off to the sheet preview component

// It is used by the character sheet view (detail route)
// but not in the review stage of the character creation process

const CharacterSheetMunger = props => {
  const id = props.id;
  const character = props.character;
  const characterSubType = props.characterSubType;
  const characterAspects = props.characterAspects;
  const skillList = props.skillList;
  const stuntList = props.stuntList;
  const activeUser = props.activeUser;
  
  const [characterSkills, setCharacterSkills] = useState({
    6: [],
    5: [],
    4: [],
    3: [],
    2: [],
    1: []
  });
  const [characterStunts, setCharacterStunts] = useState([]);
  
  const [physiqueRating, setPhysiqueRating] = useState({});
  const [willRating, setWillRating] = useState({});
  
  
  const getCharacterSkills = () => {
    ApiManager.getCharacterAttributes("characterSkills", id)
      .then(rawSkills => {
        // Before the skills are sorted into a weird format to output
        // we extract the rating of will and physique to use later
        // If they don't have a rating, consider it to be zero
        const will = rawSkills.find( ({skillId}) => skillId === 18)
        will ? setWillRating(will.skillRating) : setWillRating(0)
  
        const physique = rawSkills.find( ({skillId}) => skillId === 12)
        physique ? setPhysiqueRating(physique.skillRating) : setPhysiqueRating(0)
        return rawSkills
      })
        .then(setFormattedSkills)
  }
  
  const setFormattedSkills = (rawSkills) => {
    const stateToChange = {...characterSkills};
    // TODO: Make this loop more adaptable to different range of rating levels
    for (let i = 1; i < 7; i++) {
      stateToChange[i] = skillsByRating(rawSkills, i)
    } 
    setCharacterSkills(stateToChange)
  }
  
  const skillsByRating = (rawSkills, rating) => {
    // Converting the format of the db to the format of the form's state
    const filteredSkills = rawSkills.filter(skill => skill.skillRating === rating)

    // Note: at initial rendering, 
    // the skillList is not accessible at this point
    // so this trick keeps it from crashing...   
    let formattedSkills = []
    if (skillList.length > 0) {
      // Map a new array with the actual names of the skills,
      // found by matching the fk id from characterSkills and the skill list
      formattedSkills = filteredSkills.map(skill => skillList[skill.skillId].name)
    }
    return formattedSkills;
  }
  
  const getCharacterStunts = () => {
    ApiManager.getCharacterAttributes("characterStunts", id)
      .then(stunts => {
        let formattedStunts = [];
        // To keep this from crashing if stuntList hasn't loaded yet...
        if (stuntList.length > 0) {
          // Map a new array with the actual names of the stunts,
          // found by matching the fk id from characterStunts and the stunt list
          formattedStunts = stuntArray.map(stunt => stuntList[stunt.stuntId])
        }
        setCharacterStunts(formattedStunts)
      });
  }

  useEffect(()=>{
    getCharacterSkills();
    // FIXME: uncomment when you get skills to work...
    getCharacterStunts();
  }, [skillList, stuntList])
  
  return (
    <>
        <Container text>
          <SheetPreview 
            character={character}
            aspects={characterAspects}
            skills={characterSkills}
            stunts={characterStunts}
            physiqueRating={physiqueRating}
            willRating={willRating}
            characterSubType={characterSubType}
          />
            {/* Conditionally rendering these buttons 
              if the user created this character */}
            {activeUser && character.userId === activeUser.id 
              ? <div className="flex-end">
                  <Link to={`/characters/${id}/edit`}>
                    <Button disabled={props.isLoading} >
                      <Icon fitted className="edit outline"/>
                    </Button>
                  </Link>
                  <Button
                    className="ui button"
                    type="button"
                    onClick={() => props.handleDelete(id)}
                    disabled={props.isLoading}
                  >
                    <Icon fitted className="trash alternate outline"/>
                  </Button>
                </div>
              : <></>
            }
            <CharacterMeta character={character} userId={character.userId}/>
        </Container>
    </>
  )

}

export default CharacterSheetMunger