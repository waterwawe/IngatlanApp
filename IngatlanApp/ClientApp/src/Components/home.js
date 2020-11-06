import React from 'react';
import {Carousel,Image, Container} from 'react-bootstrap';
import Aparmentindoor from './pics/apartment-indoor.jpg';
import ApartmentOutdoor from './pics/apartment-outdoor.jpg';
import NewHouse from './pics/newhouse.jpg'

export default function Home() {
    
    return (
      <Container className="estate-slider-container">
        <Carousel className="estate-slider col-sm-11 col-md-9 col-lg-7">
  <Carousel.Item>
    <Image
      src={NewHouse}
      alt="First slide" fluid
    />
    <Carousel.Caption>
      <h3>A place where nobody disturbs you</h3>
      <p>Find your dream home, start searching now!</p>
    </Carousel.Caption>
  </Carousel.Item>
  <Carousel.Item>
    <Image
      src={Aparmentindoor}
      alt="Third slide" fluid
    />

    <Carousel.Caption>
      <h3>Your home, your ideas</h3>
      <p>Don't go for compromises</p>
    </Carousel.Caption>
  </Carousel.Item>
  <Carousel.Item>
    <Image
      src={ApartmentOutdoor}
      alt="Third slide" fluid
    />

    <Carousel.Caption>
      <h3>A place where it's great to be</h3>
      <p>Discover our real estates!</p>
    </Carousel.Caption>
  </Carousel.Item>
</Carousel>
</Container>
    )
}