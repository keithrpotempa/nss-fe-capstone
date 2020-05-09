import React, { useEffect, useState } from "react";
import SheetPreview from "../sheet/SheetPreview";

/*Sheet Review formats the information saved in state
  for a character-in-progress (either edited or created)  
  and then passes it on to the sheet preview rendering component */

const SheetReview = props => {
  const characterSubType = props.characterSubType
  const character = props.character;
  const aspects = props.aspects;
  const skills = props.skills;
  const stunts = props.stunts;
  const skillList = props.skillList;
  const stuntList = props.stuntList;
  
  const [willRating, setWillRating] = useState();
  const [physiqueRating, setPhysiqueRating] = useState();

  const [characterSkillNames, setCharacterSkillNames] = useState({
    6: [],
    5: [],
    4: [],
    3: [],
    2: [],
    1: []
  });

  const [characterStuntDetails, setCharacterStuntDetails] = useState([]);

  // Converting the skillId to names for SheetPreview purposes
  const getSkillNames = () => {
    const stateToChange = {...characterSkillNames};
    // TODO: Make this loop more adaptable to different range of rating levels
    for (let i = 1; i < 7; i++) {
      // Skipping over skill ratings that are empty
      if (skills[i].length > 0) {
        // Mapping over every skill rating's array and: 
        stateToChange[i] = skills[i].map(characterSkillId => {
          // Finding a match in ids between api skill list and character skill
          // returning that skill's name
          return skillList.find( ({id}) => id === parseInt(characterSkillId)).name
        })
      }
    } 
    setCharacterSkillNames(stateToChange)
  }

  // Converting the stuntId to name & description for SheetPreview purposes
  const getStuntNames = () => {
    const stateToChange = [...characterStuntDetails];
    // TODO: Make this loop more adaptable to different range of rating levels
    for (let i = 0; i < 5; i++) {
      const stuntMatch = stuntList.find(stunt => parseInt(stunts[i+1]) === stunt.id)
      if (stuntMatch) {
        // This formatting is intentionally weird, 
        // to match that of the sheet's, which is retrieving
        // stunts from an expanded api call:
        stateToChange[i] = {stunt: stuntMatch}
      }
    }
    setCharacterStuntDetails(stateToChange)
  }

  // This function is used to get the rating of will and physique
  // for the purposes of determining stress in the SheetPreview
  const getSkillRating = (skillId) => {
    // Start at zero, so if there's no match
    // then it defaults to zero
    let skillRating = 0;
    for (let i = 1; i < 7; i++) {
      const match = skills[i].find(skill => skill === skillId)
      // If there is a match, set the skill rating
      // to the index (the rating of the match)
      if (match) {
        skillRating = i;
      }
    }
    return skillRating
  }

  useEffect(() => {
    getSkillNames();
    getStuntNames();
    setWillRating(getSkillRating("18"))
    setPhysiqueRating(getSkillRating("12"))
  }, [])

  return (
    <>
      <SheetPreview
        character={character}
        aspects={aspects}
        skills={characterSkillNames}
        stunts={characterStuntDetails}
        physiqueRating={physiqueRating}
        willRating={willRating}
        characterSubType={characterSubType}
      />
    </>
  )
}

export default SheetReview;