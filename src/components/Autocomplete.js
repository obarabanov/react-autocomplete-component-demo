/**
 * Created by alex on 26.05.2017.
 */
import React, { Component } from 'react';

export default class Autocomplete extends Component {

  constructor(props) {
    super(props);

    this.state = {
      originalOptions: [],
      chunkedOptions: [],
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
        arr = arr.sort();
        console.info(`Loaded ${arr.length} items.`);
        this.setState({
          originalOptions: arr
        });
        this.prepareData(arr);//.slice(0, 1000));
      })
      .catch(err => console.error(err));
  }

  prepareData(sortedArray) {

    let chunksByLetter = {},
      prevLetter = '',
      arrChunk = [];

    /*
    //  for testing only
    let numChunks = 0,
      totally = 0;
    */

    for (let index = 0; index < sortedArray.length; index++) {

      const item = sortedArray[index]; // string value
      const letter = item[0].toLowerCase();
      //console.log(`Letter: ${letter} prevLetter: ${prevLetter}`);

      if (letter !== prevLetter) {  
        /*      
        // testing
        totally += arrChunk.length; 
        numChunks++;                
        //console.log(`'${prevLetter}' chunk length: ${arrChunk.length}`);
        */

        chunksByLetter[prevLetter] = arrChunk;
        prevLetter = letter;
        arrChunk = [];
      }

      arrChunk.push(item);

    }

    this.setState({ 
      chunkedOptions: chunksByLetter,
      originalOptions: [] // to reduce memory consumption, drop original array as it's not needed anymore.
    });

    //  testing
    /*
    console.log(`Totally ${totally} items in ${numChunks} chunks.`); // in 27 chunks. - that's fine, first is ''/zero one.
    console.log(`'a' chunk length: ${chunksByLetter.a.length}`);
    console.log(`'a' chunk first: ${chunksByLetter.a[0]}`);
    console.log(`'z' chunk length: ${chunksByLetter.z.length}`);
    console.log(`'z' chunk last: ${chunksByLetter.z[chunksByLetter.z.length - 1]}`);
    console.log(`'z' chunk: ${chunksByLetter.z}`);
    */

  }

  /**
   * Autocomplete activation:
   * - ignore single symbol
   * - start filtering after 2 or more symbols
   * 
   * @param {*} event 
   */
  handleInput(event) {
    const input = event.target.value;
    this.setState({ txtInput: input });

    //  TODO: improvement - set small delay before input procession, if typed really fast

    if (input.length <= 1) {
      //  it doesn't make any sense trying to autocomplete after single char has been entered.
      event.preventDefault();
      this.setState({ suggestedOptions: [] }); // empty suggestions
      return;
    }
    //console.log(`processing: ${input}`);
    this.filterOptions( input );
  }

  filterOptions( input ) {
    const firstLetter = input[0].toLowerCase();
    const chunk = this.state.chunkedOptions[firstLetter];
    const found = chunk.filter(item =>
      item.toLowerCase().startsWith(input.toLowerCase()) // > that start with the prefix typed so far.
      //item.toLowerCase().indexOf(input.toLowerCase()) > -1 // includes
    );
    console.log(`found matches: ${found.length} of chunk size: ${chunk.length}`);

    this.setState({
      suggestedOptions: found
    });
  }

  render() {

    const options = this.state.suggestedOptions
      .slice(0, 5) // to show not more than 5 suggestions.
      .map((value, index) =>
        <option key={index} value={value} />
      );

    return (
      <div>
        <br />Type here:<br />

        <input id="txtInput" type="text"
          autoComplete="on" list="suggested"
          value={this.state.txtInput}
          onInput={this.handleInput}
        />

        <datalist id="suggested">
          {options}
        </datalist>

      </div>
    );
  }
}
