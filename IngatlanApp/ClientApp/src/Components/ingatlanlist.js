import React, { useState, useEffect } from 'react'
import { ApiCallItem } from '../Api'
import { ListGroup, Alert, Pagination } from 'react-bootstrap'
import IngatlanThumbnail from './ingatlanthumbnail'

export default function IngatlanList({ queryobj, refresh }) {

  const pagesize = 10;

  const [searchObj, setSearchObj] = useState({});
  const [ingatlanList, setList] = useState([]);
  const [listToDisplay, setListToDisplay] = useState([]);
  const [error, setError] = useState(false);
  const [done, setDone] = useState(false);
  const [pageNumbers, setPageNumbers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);


  const [newestActive, setNewest] = useState(false);
  const [LowToHighActive, setLowToHigh] = useState(false);
  const [HighToLowActive, setHighToLow] = useState(false);


  const serialize = function (obj, prefix) {
    var str = [], p;
    for (p in obj) {
      if (obj.hasOwnProperty(p)) {
        var k = prefix ? prefix + "[" + p + "]" : p,
          v = obj[p];
        str.push((v !== null && typeof v === "object") ?
          serialize(v, k) :
          encodeURIComponent(k) + "=" + encodeURIComponent(v));
      }
    }
    return str.join("&");
  }

  const getIngatlan = async () => {
    if (!done) {
      setSearchObj(queryobj);
      const response = await fetch(`${ApiCallItem}/?${serialize(queryobj)}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      if (response.ok) {
        setError(false);
        const json = await response.json();
        setList(json);
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
    list.map((ingatlan) => {
      if ((pagenumber - 1) * pagesize < (list.indexOf(ingatlan) + 1) && (list.indexOf(ingatlan) + 1) <= (pagenumber * pagesize))
        newList.push(ingatlan);
    });
    setListToDisplay(newList);
  }

  const orderNewestFirst = () => {
    setLowToHigh(false);
    setHighToLow(false);
    setNewest(true);

    let newList = ingatlanList.sort((a, b) => (a.createdAt < b.createdAt) ? 1 : -1);
    setList(newList);
    initListToDisplay(currentPage,newList);
  }

  const orderPriceLowToHigh = () => {
    setLowToHigh(true);
    setHighToLow(false);
    setNewest(false);

    let newList = ingatlanList.sort((a, b) => (a.price > b.price) ? 1 : -1);
    setList(newList);
    initListToDisplay(currentPage,newList);
  }

  const orderPriceHighToLow = () => {
    setLowToHigh(false);
    setHighToLow(true);
    setNewest(false);

    let newList = ingatlanList.sort((a, b) => (a.price < b.price) ? 1 : -1);
    setList(newList);
    initListToDisplay(currentPage,newList);
  }

  useEffect(() => {
    if (queryobj !== searchObj) {
      setDone(false);
      getIngatlan();
    }
  }, [queryobj, refresh])

  return (
    <div className="ingatlan-list">
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
        {error ? <Alert show={true}>No matches found</Alert> : listToDisplay.map((ingatlan) => {
          return (<IngatlanThumbnail key={ingatlan.id} ingatlan={ingatlan} />);
        })}
      </ListGroup>
      <Pagination>
        <Pagination.First onClick={() => { initListToDisplay(1, ingatlanList) }} />
        <Pagination.Prev onClick={() => {
          if (currentPage - 1 > 0)
            initListToDisplay(currentPage - 1, ingatlanList)
        }} />
        {pageNumbers.map((pagenum) => {
          if (Math.abs(currentPage - pagenum) <= 5) {
            if (currentPage === pagenum)
              return (<Pagination.Item key={pagenum} active>{pagenum}</Pagination.Item>);
            else
              return (<Pagination.Item key={pagenum} onClick={() => { initListToDisplay(pagenum, ingatlanList) }}>{pagenum}</Pagination.Item>);
      }})}
        <Pagination.Next onClick={() => {
          if (currentPage + 1 <= pageNumbers.length)
            initListToDisplay(currentPage + 1, ingatlanList)
        }} />
        <Pagination.Last onClick={() => { initListToDisplay(pageNumbers.length, ingatlanList) }}/>
      </Pagination>
    </div>
  );
}