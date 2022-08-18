import React from 'react';
import AppViews from './views/AppViews.js';
import DeployerViews from './views/DeployerViews.js';
import AttacherViews from './views/AttacherViews.js';
import {renderDOM, renderView} from './views/render.js';
import './index.css';
import * as backend from './build/index.main.mjs';
import { loadStdlib } from '@reach-sh/stdlib';
const reach = loadStdlib(process.env);


const {standardUnit} = reach;
const defaults = {defaultFundAmt: '10', defaultWager: '3', standardUnit};

class App extends React.Component {
    constructor(props) {
      super(props);
      this.state = {view: 'ConnectAccount', ...defaults};
    }
    async componentDidMount() {
      const acc = await reach.getDefaultAccount();
      const balAtomic = await reach.balanceOf(acc);
      const bal = reach.formatCurrency(balAtomic, 4);
      this.setState({acc, bal});
      if (await reach.canFundFromFaucet()) {
        this.setState({view: 'FundAccount'});
      } else {
        this.setState({view: 'DeployerOrAttacher'});
      }
    }
    async fundAccount(fundAmount) {
      await reach.fundFromFaucet(this.state.acc, reach.parseCurrency(fundAmount));
      this.setState({view: 'DeployerOrAttacher'});
    }
    async skipFundAccount() { this.setState({view: 'DeployerOrAttacher'}); }
    selectAttacher() { this.setState({view: 'Wrapper', ContentView: Attacher}); }
    selectDeployer() { this.setState({view: 'Wrapper', ContentView: Deployer}); }
    render() { return renderView(this, AppViews); }
  }


  class Deployer extends React.Component {
    constructor() {
       super();
       this.state = {view: 'Deploy'};
    }
    // setWager(wager) { this.setState({view: 'Deploy', wager}); }
    async deploy() {
      const ctc = this.props.acc.contract(backend);
      this.setState({view: 'Deploying', ctc});
    //   this.wager = reach.parseCurrency(this.state.wager); 
     this.deadline = {ETH: 10, ALGO: 100, CFX: 1000}[reach.connector];
      backend.Alice(ctc, this);
      const ctcInfoStr = JSON.stringify(await ctc.getInfo(), null, 2);
      this.setState({view: 'WaitingForAttacher', ctcInfoStr});
    }
    async getAcceptanceOfFortune(fortune) {
      return await new Promise(resolveAcceptedP => {
        this.setState({view: 'AcceptTerms', fortune, resolveAcceptedP});
      });
    }
    fortuneAccepted(accepted) {
      this.state.resolveAcceptedP(accepted);
      if(!accepted){
        this.setState({view: 'WaitingForTurn'});
      }
    }
    render() { return renderView(this, DeployerViews); }
  }

  class Attacher extends React.Component {
    constructor() {
      super();
      this.state = {view: 'Attach'};
    }
    attach(ctcInfoStr) {
      const ctc = this.props.acc.contract(backend, JSON.parse(ctcInfoStr));
      this.setState({view: 'Attaching'});
      backend.Bob(ctc, this);
    }
    async readFortune() {
      const fortune = await new Promise(resolveFortune => {
          this.setState({view: 'ReadFortune', resolveFortune});
        });
        console.log("Resolved");
      this.setState({view: 'WaitingForResults', fortune});
      console.log("Attacher exiting... fortune is:", fortune);  
        return fortune;
    }
    tellFortune(fortune) { 
      console.log("The fortune is:", fortune);
      this.state.resolveFortune(fortune); }
    render() { return renderView(this, AttacherViews); }
  }

renderDOM(<App />);