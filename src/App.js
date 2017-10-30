import React, { Component } from "react";
import Autosuggest from "react-autosuggest";
import getSuggestions from "./Server";

/* ----------- */
/*    Utils    */
/* ----------- */

/* --------------- */
/*    Component    */
/* --------------- */

function getSuggestionValue(suggestion) {
  return suggestion;
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  // console.log(query)
  // console.log(suggestion)
  var suggestionHighLight = suggestion;
  var query_regexp = new RegExp(query, "g");
  suggestionHighLight = suggestionHighLight.replace(
    query_regexp,
    "<span class='highlight'>" + query + "</span>"
  );

  function createMarkup() {
    return { __html: suggestionHighLight };
  }

  console.log(suggestionHighLight);

  // let config = [{
  //                 regex: new RegExp(partialQuery, "g"),
  //                 fn: (key, result) => (<span key={key} className="highlight">
  //                                          {result}
  //                                      </span>)
  //                                      // highlight
  //             }];

  // let processed = processString(config)(suggestionHighLight);
  // console.log(processed)

  return (
    // <span>
    //   {processed}
    // </span>
    <span dangerouslySetInnerHTML={createMarkup()} />
  );
}

class App extends Component {
  constructor() {
    super();

    this.state = {
      value: "",
      suggestions: [],
      isLoading: false,
      partialQuery: ""
    };

    this.lastRequestId = null;
  }

  loadSuggestions(value) {
    console.log(value.split(" "));
    let partialQueryValue = "";
    let valueArrayClean = [];
    let valueLength = value.split(" ").length;
    console.log(valueLength);

    if (valueLength > 1) {
      valueArrayClean = value.split(" ").filter(v => v);
      let partialQueryValue = valueArrayClean[valueArrayClean.length - 1];
      if (partialQueryValue && partialQueryValue !== "") {
        value = partialQueryValue;
      }
    }

    console.log(partialQueryValue);

    this.setState({
      isLoading: true,
      partialQuery: partialQueryValue
    });

    // Make request
    const thisRequest = (this.latestRequest = getSuggestions(value)
      // .then(res => res.json())
      .then(
        res => {
          // If this is true there's a newer request happening, stop everything
          if (thisRequest !== this.latestRequest) {
            return;
          }

          // If this is executed then it's the latest request
          console.log(res);
          this.setState({
            suggestions: res,
            isLoading: false
          });
        },
        err => {
          // If this is true there's a newer request happening, stop everything
          if (thisRequest !== this.latestRequest) {
            return;
          }

          // If this is executed then it's the latest request
          console.log(err);
          this.setState({
            suggestions: [],
            isLoading: false
          });
        }
      ));
  }

  onChange = (event, { newValue }) => {
    const { value } = this.state;
    console.log(value);
    this.setState({
      value: newValue
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.loadSuggestions(value);
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  render() {
    const { value, suggestions, isLoading } = this.state;
    const inputProps = {
      placeholder: "What are you looking for ...",
      value,
      onChange: this.onChange
    };
    const status = isLoading ? "Loading..." : "Type to load suggestions";

    console.log(status);

    return (
      <div>
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps}
        />
      </div>
    );
  }
}

export default App;
