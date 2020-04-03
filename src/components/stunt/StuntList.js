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

  // State related to pagination 
  // reference: https://www.npmjs.com/package/react-hooks-paginator
  const pageLimit = 6;
  const [offset, setOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentData, setCurrentData] = useState([]);

  useEffect(() => {
    setCurrentData(stunts.slice(offset, offset + pageLimit))
  }, [offset, stunts])

  return (
    <>
        <Card.Group itemsPerRow={2}>
          {currentData.map(stunt => 
            <StuntCard
              key={stunt.id}
              stunt={stunt}
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