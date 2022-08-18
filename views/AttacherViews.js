import React from 'react';

const exports = {};

exports.Wrapper = class extends React.Component {
  render() {
    const {content} = this.props;
    return (
      <div className="Attacher">
        <h2>Attacher (Bob)</h2>
        {content}
      </div>
    );
  }
}

exports.Attach = class extends React.Component {
  render() {
    const {parent} = this.props;
    const {ctcInfoStr} = this.state || {};
    return (
      <div>
        Please paste the contract info to attach to:
        <br />
        <textarea spellCheck="false"
          className='ContractInfo'
          onChange={(e) => this.setState({ctcInfoStr: e.currentTarget.value})}
          placeholder='{}'
        />
        <br />
        <button
          disabled={!ctcInfoStr}
          onClick={() => parent.attach(ctcInfoStr)}
        >Attach</button>
      </div>
    );
  }
}

exports.Attaching = class extends React.Component {
  render() {
    return (
      <div>
        Attaching, please wait...
      </div>
    );
  }
}

exports.WaitingForResults = class extends React.Component {
  render() {
    return (
      <div>
        Waiting for results...
      </div>
    );
  }
}

exports.ReadFortune = class extends React.Component {
  render() {
    const {parent} = this.props;
    let fortune =(this.state || {}).fortune || "default";
    
    function handleClick() {
      console.log("Handle click, Fortune is: ", fortune);
      parent.tellFortune(fortune)
    }

    function handleChange(e){
      console.log("Changed Value:", e.currentTarget.value);
      fortune=e.currentTarget.value;
      console.log("Fortune is ", fortune);
    }
    return (
      <div>
        <input
          type='text'
          placeholder="Writeup the fortune"
          onChange={(e) => handleChange(e)}
        /> 
        <br />
        <button
        
          onClick={handleClick}
        >Read Fortune</button>
      </div>
    );
  }
}

export default exports;