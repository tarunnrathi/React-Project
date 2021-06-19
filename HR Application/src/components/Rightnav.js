import React, { Component } from "react";
import { Link, Redirect } from 'react-router-dom';
import './Style.css';


export default class Rightnav extends Component {
    render() {
        return (
            <div>
                <nav className="bg-dark">
      <ul class="ddnav-menu ddnav-vertical">
        <li><a href="#">HR Menu 1</a></li>
        <li><a href="#" class="ddnav-active">HR Menu 2</a>
          <ul>
            <li><a href="#">Sub Nav Link</a></li>
            <li><a href="#">Sub Nav Link</a>
              <ul>
                <li><a href="#">Sub Sub Nav Link</a></li>
                <li><a href="#">Sub Sub Nav Link</a></li>
                <li><a href="#">Sub Sub Nav Link</a></li>
              </ul>
            </li>
            <li><a href="#">Sub Nav Link</a></li>
            <li><a href="#">Sub Nav Link</a></li>
          </ul>
        </li>
        <li><a href="#">HR Menu 3</a></li>
        <li><a href="#">HR Menu 4</a></li>
        <li><a href="#">HR Menu 5</a></li>
        <li><a href="#">HR Menu 6</a></li>
        <li><a href="#">HR Menu 7</a></li>
        <li><a href="#">HR Menu 8</a></li>
        <li><a href="#">HR Menu 3</a></li>
        <li><a href="#">HR Menu 4</a></li>
        <li><a href="#">HR Menu 5</a></li>
        <li><a href="#">HR Menu 6</a></li>
        <li><a href="#">HR Menu 7</a></li>
        <li><a href="#">HR Menu 8</a></li>
      </ul>
    </nav>
            </div>
        )
    }
}
