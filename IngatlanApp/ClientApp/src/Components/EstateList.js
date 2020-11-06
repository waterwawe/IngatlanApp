import React, { useState, useEffect } from 'react'
import { ListGroup, Alert, Pagination, Dropdown } from 'react-bootstrap'
import {getEstates} from '../Services/EstateService'
import EstateThumbnail from './EstateThumbnail'

export default function EstateList({ queryobj }) {

  const pagesize = 10;

  const [searchObj, setSearchObj] = useState({});
  const [estateList, setList] = useState([]);
  const [highlightList, setHighlightlist] = useState([]);
  const [listToDisplay, setListToDisplay] = useState([]);
  const [error, setError] = useState(false);
  const [done, setDone] = useState(false);
  const [pageNumbers, setPageNumbers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);


  const [newestActive, setNewest] = useState(false);
  const [LowToHighActive, setLowToHigh] = useState(false);
  const [HighToLowActive, setHighToLow] = useState(false);

  const getestate = async () => {
    if (!done) {
      setSearchObj(queryobj);
      const response = await getEstates(queryobj);
      if (response.ok) {
        setError(false);
        const json = await response.json();
        let highList = [];
        let normalList = [];
        json.forEach(estate => {
          if (estate.isHighlighted) {
            highList.push(estate);

          }
          else {
            normalList.push(estate);
          }
        });
        setHighlightlist(highList);
        setList(normalList);
        let pagelist = [];
        pagelist.push(1);
        let pagenumber = 1;
        for (let i = 0; i < json.length; i++) {
          if (i >= pagesize * pagenumber) {
            pagenumber++;
            pagelist.push(pagenumber);
          }
        }
        initListToDisplay(currentPage, json);
        setPageNumbers(pagelist);
      }
      else {
        setError(true);
      }
    }
  }

  const initListToDisplay = (pagenumber, list) => {
    setCurrentPage(pagenumber);
    let newList = [];
    list.map((estate) => {
      if ((pagenumber - 1) * pagesize < (list.indexOf(estate) + 1) && (list.indexOf(estate) + 1) <= (pagenumber * pagesize))
        newList.push(estate);
    });
    setListToDisplay(newList);
  }

  const orderNewestFirst = () => {
    setLowToHigh(false);
    setHighToLow(false);
    setNewest(true);

    let newHighlighted = highlightList.sort((a, b) => (a.createdAt < b.createdAt) ? 1 : -1);
    setHighlightlist(newHighlighted);
    let newList = estateList.sort((a, b) => (a.createdAt < b.createdAt) ? 1 : -1);
    setList(newList);
    initListToDisplay(currentPage, newList);
  }

  const orderPriceLowToHigh = () => {
    setLowToHigh(true);
    setHighToLow(false);
    setNewest(false);

    let newHighlighted = highlightList.sort((a, b) => (a.price > b.price) ? 1 : -1);
    setHighlightlist(newHighlighted);
    let newList = estateList.sort((a, b) => (a.price > b.price) ? 1 : -1);
    setList(newList);
    initListToDisplay(currentPage, newList);
  }

  const orderPriceHighToLow = () => {
    setLowToHigh(false);
    setHighToLow(true);
    setNewest(false);

    let newHighlighted = highlightList.sort((a, b) => (a.price < b.price) ? 1 : -1);
    setHighlightlist(newHighlighted);
    let newList = estateList.sort((a, b) => (a.price < b.price) ? 1 : -1);
    setList(newList);
    initListToDisplay(currentPage, newList);
  }

  useEffect(() => {
    if (queryobj !== searchObj) {
      setDone(false);
      getestate();
    }
  }, [queryobj])

  return (
    <div className="estate-list">
      <ListGroup horizontal>
        <ListGroup.Item active={newestActive} action onClick={orderNewestFirst}>
          Newest first
    </ListGroup.Item>
        <ListGroup.Item active={LowToHighActive} action onClick={orderPriceLowToHigh}>
          Price: Low to High
    </ListGroup.Item>
        <ListGroup.Item active={HighToLowActive} action onClick={orderPriceHighToLow}>
          Price: High to Low
    </ListGroup.Item>
      </ListGroup>
      <ListGroup>
        {error ? <Alert show={true}>No matches found</Alert> :
          <>{currentPage === 1 && highlightList.length !== 0 ?
            <>
              {highlightList.length > 0 ?  <h4> Highlighted ads</h4> : <></>}
              {highlightList.map((estate) => {
                return (<EstateThumbnail key={estate.id} estate={estate} />);
              })
              }
              <Dropdown.Divider/>
            </>
            : <>
            </>}
            {listToDisplay.map((estate) => {
              return (<EstateThumbnail key={estate.id} estate={estate} />);
            })}</>}
      </ListGroup>
      <Pagination>
        <Pagination.First onClick={() => { initListToDisplay(1, estateList) }} />
        <Pagination.Prev onClick={() => {
          if (currentPage - 1 > 0)
            initListToDisplay(currentPage - 1, estateList)
        }} />
        {pageNumbers.map((pagenum) => {
          if (Math.abs(currentPage - pagenum) <= 5) {
            if (currentPage === pagenum)
              return (<Pagination.Item key={pagenum} active>{pagenum}</Pagination.Item>);
            else
              return (<Pagination.Item key={pagenum} onClick={() => { initListToDisplay(pagenum, estateList) }}>{pagenum}</Pagination.Item>);
          }
        })}
        <Pagination.Next onClick={() => {
          if (currentPage + 1 <= pageNumbers.length)
            initListToDisplay(currentPage + 1, estateList)
        }} />
        <Pagination.Last onClick={() => { initListToDisplay(pageNumbers.length, estateList) }} />
      </Pagination>
    </div>
  );
}