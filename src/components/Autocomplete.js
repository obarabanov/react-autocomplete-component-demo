/**
 * Created by Oleksandr Barabanov on 26.05.2017
 */
import React, { Component } from 'react';

export default class Autocomplete extends Component {

  constructor(props) {
    super(props);

    this.state = {
      suggestedOptions: [],
      txtInput: ''
    };

    this.handleInput = this.handleInput.bind(this);
  }

  componentDidMount() {
    const json = fetch('birds.json');
    json
      .then(data => data.json())
      .then(arr => {
        console.info(`Loaded ${arr.length} items.`);
        this.prepareData(arr);//.slice(0, 1000));
      })
      .catch(err => console.error(err));
  }

  prepareData(arr) {
    const chunksByLetter = new Map();

    for (let item of arr) { // string value
      const letter = item[0].toLowerCase();

      if (chunksByLetter.has(letter)) {
        const chunk = chunksByLetter.get(letter);
        chunk.push(item);
      } else {
        chunksByLetter.set(letter, [item]);
      }
    }
    //console.log('chunked:', chunksByLetter);
    this.chunkedOptions = chunksByLetter;
  }

  /**
   * Autocomplete activation:
   * - start filtering after a symbol typed
   * 
   * TODO: improvement - set small delay before input procession, if typed really fast
   * 
   * @param {*} event 
   */
  handleInput(event) {
    const input = event.target.value;
    this.setState({ txtInput: input });

    if (input.length < 1) {
      event.preventDefault();
      this.setState({ suggestedOptions: [] }); // empty suggestions
      return;
    }
    this.filterOptions( input );
  }

  filterOptions( input ) {
    const firstLetter = input[0].toLowerCase();
    const chunk = this.chunkedOptions.get(firstLetter) || [];
    const found = chunk.filter(item =>
      item.toLowerCase().startsWith(input.toLowerCase()) // starting with the prefix typed so far
    );
    console.log(`found matches: ${found.length} in '${firstLetter}' chunk of ${chunk.length}`);

    this.setState({
      suggestedOptions: found
    });
  }

  render() {
    const options = this.state.suggestedOptions
      .slice(0, 10) // to show not more than 10 suggestions.
      .map((value, index) =>
        <option key={index} value={value} />
      );

    return (
      <div>
        <br />Type here:<br />

        <input id="txtInput" type="text" placeholder="bird name"
          autoComplete="on" list="suggested"
          value={this.state.txtInput}
          onInput={this.handleInput} />

        <datalist id="suggested">
          {options}
        </datalist>

      </div>
    );
  }
}
