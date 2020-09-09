import React, { useEffect, useState } from 'react';
import { Card, Form, Row, ListGroup } from 'react-bootstrap';
import IngatlanList from './ingatlanlist';
import { ApiCallItem, Ingatlantypes } from '../Api';

export default function Search() {
  const [searchObj, setSearchObj] = useState({});
  const [descContains, setDesc] = useState("");
  const [cities, setCities] = useState([""]);
  const [districts, setDistricts] = useState([]);
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState(0);
  const [types, setTypes] = useState([]);
  const [priceFrom, setPriceFrom] = useState();
  const [priceTo, setPriceTo] = useState();

  const refresh = () => {
    return null;
  }

  function titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(' ');
  }

  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      const context = this;
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        timeout = null;
        func.apply(context, args);
      }, wait);
    };
  }

  function romanize(num) {
    if (isNaN(num))
      return NaN;
    var digits = String(+num).split(""),
      key = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM",
        "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC",
        "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"],
      roman = "",
      i = 3;
    while (i--)
      roman = (key[+digits.pop() + (i * 10)] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
  }

  const getCities = async () => {
    const response = await fetch(`${ApiCallItem}/cities`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
    });
    const json = await response.json();
    setCities(json);
  }

  const getDistricts = async () => {
    const response = await fetch(`${ApiCallItem}/districts`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
    });
    const json = await response.json();
    setDistricts(json);
  }

  const searchIngatlans = (desc) => {
    let queryObject = {};

    if (desc) {
      queryObject.descriptionContains = desc.split(" ");
    }
    else if(descContains){
      queryObject.descriptionContains = descContains.split(" ");
    }

    if (city)
      queryObject.city = city;

    if (district)
      queryObject.district = district;

    if (types)
      queryObject.ingatlantype = types;

    if (priceFrom)
      queryObject.priceFrom = priceFrom;

    if (priceTo)
      queryObject.priceTo = priceTo;

      console.log(queryObject);
      setSearchObj(queryObject);
      refresh();
  }

  const onMultipleSelectChange = e => {
    let typelist = types;
    let index = typelist.indexOf(e.target.value);

    if (index > 0) {
      typelist.map((type) => {
        if (typelist.indexOf(type) !== index)
          typelist.splice(typelist.indexOf(type), 1);
      })
    }
    else
      typelist.push(e.target.value);
    setTypes(typelist);
    searchIngatlans();
  };

  const handleChange = (value) => {
    searchIngatlans(value);
  }

  const debounceHandleChange = React.useCallback(debounce(handleChange, 370), []);

  useEffect(() => {
    if (city || district || priceFrom || priceTo) {
      searchIngatlans();
    }
    else {
      getCities();
      getDistricts();
      searchIngatlans();
    }

  }, [city, district, priceFrom, priceTo])

  return (
    <div className="d-flex justify-content-center">
      <Card className="col-md-11 col-lg-9" bg="light" variant="light">
        <Card bg="light" variant="light">
          <ListGroup horizontal className="search-form">
            <ListGroup.Item className="search-from-element col-sm-11 col-md-5 col-lg-4 col-xl-3">
              <Form.Group>
                <Form.Label>Select City</Form.Label>
                <Form.Control as="select" value={city} onChange={e => { setCity(e.target.value); }}>
                  <option value="" key="">Select one</option>
                  {cities.map((city) => {
                    return (<option value={city} key={city}>{titleCase(city)}</option>)
                  })}
                </Form.Control>
                {city.toLocaleLowerCase() === "budapest" ? (<div><Form.Label>Select district</Form.Label>
                  <Form.Control as="select" value={district} onChange={e => { setDistrict(e.target.value); }}>
                    <option value="0" key="0">Select one</option>
                    {districts.map((dist) => {
                      if (dist !== 0)
                        return (<option value={dist} key={dist}>{romanize(dist)}</option>)
                    })}
                  </Form.Control></div>) : <></>}
              </Form.Group>
            </ListGroup.Item>
            <ListGroup.Item className="search-from-element col-sm-11 col-md-5 col-lg-2 col-xl-2">
              <Form.Label>Starting price:</Form.Label>
              <Form.Control className="price-input" type="number" min="0" step="0.1" placeholder="XX,X" value={priceFrom} onChange={e => { setPriceFrom(e.target.value); }} />
              <Form.Label>Ending price:</Form.Label>
              <Form.Control className="price-input" type="number" min="0" step="0.1" placeholder="XX,X" value={priceTo} onChange={e => { setPriceTo(e.target.value); }} />
            </ListGroup.Item>
            <ListGroup.Item className="search-from-element col-sm-11 col-md-5 col-lg-5 col-xl-3">
              <Form.Group>
                <Form.Label>Description contains</Form.Label>
                <Form.Control type="text" as="textarea" rows="2" size="sm" placeholder="Enter desired words in description" value={descContains} onChange={e => { setDesc(e.target.value); debounceHandleChange(e.target.value) }} />
              </Form.Group>
            </ListGroup.Item>
            <ListGroup.Item className="search-from-element col-sm-11 col-md-5 col-lg-11 col-xl-3">
              <Form.Group>
                <Form.Label> Select desired estate types</Form.Label>
                <Form.Control className="" as="select" multiple value={types} onChange={onMultipleSelectChange}>
                  <option value="1">{Ingatlantypes(1)}</option>
                  <option value="2">{Ingatlantypes(2)}</option>
                  <option value="3">{Ingatlantypes(3)}</option>
                  <option value="4">{Ingatlantypes(4)}</option>
                  <option value="5">{Ingatlantypes(5)}</option>
                </Form.Control>
              </Form.Group>
            </ListGroup.Item>
          </ListGroup>
        </Card>
        <IngatlanList queryobj={searchObj} refresh={refresh} />
      </Card>
    </div>
  )

}