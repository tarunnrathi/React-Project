import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter, customFilter, Comparator, FILTER_TYPES,PriceFilter } from 'react-bootstrap-table2-filter';
import PropTypes from 'prop-types';


class Favourites extends Component {
  constructor() {
    super();
    this.onSubmitForm = this.onSubmitForm.bind(this);
    //this.input= React.createRef();
  }

  onSubmitForm() {
    debugger
    var t = this.input.value;
    console.log(t);
  }

  render() {
    return (
      <div>
        <div>
          <label>
            First Name :
            <input
              name="fname"
              type="text"
              ref={myinput => (this.input = myinput)}
            />
          </label>
        </div>
        <div>
          <button onClick={this.onSubmitForm}>Submit</button>
        </div>
      </div>
    );
  }
}
export default Favourites;