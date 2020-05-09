import React, { useEffect, useState } from "react";
import Paginator from "react-hooks-paginator";
import { Card } from "semantic-ui-react"
import StuntCard from "./StuntCard"

/* 
  Child component of Stunts
  this receives a list of stunts
  (filtered or not) and renders them with pagination
*/
const StuntList = props => {
  const stunts = props.stunts;
  const skills = props.skills;

  // State related to pagination 
  // reference: https://www.npmjs.com/package/react-hooks-paginator
  const pageLimit = 9;
  const [offset, setOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentData, setCurrentData] = useState([]);

  useEffect(() => {
    setCurrentData(stunts.slice(offset, offset + pageLimit))
  }, [offset, stunts])

  return (
    <>
        <Card.Group itemsPerRow={3}>
          {currentData.map((stunt, index) => 
            <StuntCard
              key={`stunt-${stunt.id}`}
              stunt={stunt}
              skill={skills.find(skill => skill.id === stunt.skillId)}
            />  
          )}
        </Card.Group>
        <Paginator 
          totalRecords={stunts.length}
          pageLimit={pageLimit}
          pageNeighbours={2}
          setOffset={setOffset}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
    </>
  )
}

export default StuntList