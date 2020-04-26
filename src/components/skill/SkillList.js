import React, { useState, useEffect } from "react";
import Paginator from "react-hooks-paginator";
import { Card, Container } from "semantic-ui-react"
import ApiManager from "../../modules/ApiManager";
import SkillCard from "./SkillCard"
// import firebase from "../../firebase"

const SkillList = props => {
  const [skills, setSkills] = useState([]);

  // State related to pagination 
  // reference: https://www.npmjs.com/package/react-hooks-paginator
  const pageLimit = 9;
  const [offset, setOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentData, setCurrentData] = useState([]);

  // Failed attempt at firebase api get:
  // const getSkills = () => {
  //   // const skill_list = ApiManager.firebaseGetAll("skills")
  //   const ref = firebase.database().ref("skills");
  //   ref.on('value', (snapshot) => {
  //     let skill_list = snapshot.val();
  //     setSkills(skill_list)
  //   })
  // }

  const getSkills = () => {
    return ApiManager.getAll("skills")
      .then(setSkills);
  }

  useEffect(() => {
    getSkills();
    setCurrentData(skills.slice(offset, offset + pageLimit))
  }, [offset, skills])

  return (
    <>
      <Container>
        <div className="header-container">
          <h1>Skills</h1>
        </div>
        <Card.Group stackable itemsPerRow={3}>
          {currentData.map(skill => 
            <SkillCard
              key={skill.id}
              skill={skill}
            />  
          )}
        </Card.Group>
        <Paginator 
          totalRecords={skills.length}
          pageLimit={pageLimit}
          pageNeighbours={2}
          setOffset={setOffset}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </Container>
    </>
  )
}

export default SkillList