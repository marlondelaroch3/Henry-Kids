import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Nav from "../Nav/Nav.jsx";
import { Link } from "react-router-dom";
import { styled } from "@material-ui/core";
import styles from "./Home.module.css";
import Card from "../Card/Card.jsx";
import { getAllclasses } from "../../actions/index.js";

export default function Home() {
  const dispatch = useDispatch();
  const allClasses = useSelector((state) => state.allClasses);

  useEffect(() => dispatch(getAllclasses()), [dispatch]);

  return (
    <div className={styles.home}>
      <div>
        <Nav />
      </div>

      <div className={styles.cards}>
      {allClasses.map((e) => { 
        return (<div key= {e.id}> <Link to={'/home/'+ e.id}> <Card 
        id={e.id}
        title={e.title}
        category={e.category}
        description={e.description}
        video_link={e.video_link}
        difficulty={e.difficulty}
        game_link={e.game_link}
        valoration={e.valoration}
        /> </Link></div>)}
      )} 
      </div>
    </div>
  );
}
