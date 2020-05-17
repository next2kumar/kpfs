import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import Doc from '../abis/Doc.json'

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values

class Dock extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = Doc.networks[networkId]
    if(networkData) {
      const contract = web3.eth.Contract(Doc.abi, networkData.address)
      this.setState({ contract })
      //const memeHash = await contract.methods.getHash(1).call()
      //this.setState({ memeHash })
    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      memeHash: 'QmWaj4wanu9iMMCELwGsfc5Ny25aggF44BaXnK7Afnzhkp',
      contract: null,
      web3: null,
      buffer: null,
      account: null,
      id:"",
      notes:"",
      notesid:''
    }
  }

  // captureText= (event) => {
  //   event.preventDefault()
  //   console.log("event ",event);
  //   this.setState({ id: event.toString() })
   
    // reader.onloadend = () => {
    //   this.setState({ buffer: Buffer(reader.result) })
    //   console.log('buffer', this.state.buffer)
    // }
  //}

   handleChange = e => {
    let xxx = e.target.value.replace(/\D/,'');
    xxx=parseInt(xxx);
    this.setState({id: xxx});
    console.log("xxx "+xxx);
  }

  handleNoteIdChange = e => {
    let xxx = e.target.value.replace(/\D/,'');
    xxx=parseInt(xxx);
    this.setState({notesid: xxx});
    console.log("xxx "+xxx);
  }

  handleNoteChange = e => {
    let xxy = e.target.value;
    this.setState({notes: xxy});
    console.log("notes xxx "+xxy);
  }

  // handleChange = (event) => {
  //   event.preventDefault()
    
  //   this.setState({id: event.target.id});
  //   console.log("event " + this.state.id)
  // }
  onSubmitNotes = (event) => {
    event.preventDefault()
    this.pushNotes();
  }


  async pushNotes(){
    let newHash='';
console.log("notes to push");

await this.state.contract.methods.doctorNotes((this.state.id),this.state.notes).send({ from: this.state.account }).then((r) => {
  //newHash=r;
  //console.log(newHash);

  return true;
  
});
this.setState({ memeHash: newHash });
console.log("new hash "+this.state.memeHash);
  }

   onSubmit = (event) => {
    event.preventDefault()
    this.getNewHash();
    
    //const memeHash = await contract.methods.get(this.state.id).call();
     
    //console.log("Submitting file to ipfs...")
    //ipfs.add(this.state.buffer, (error, result) => {
      //console.log('Ipfs result', result)
    //   if(error) {
    //     console.error(error)
    //     return
    //   }
    //    this.state.contract.methods.set(result[0].hash).send({ from: this.state.account }).then((r) => {
    //      return this.setState({ memeHash: result[0].hash })
    //    })
    // })
  }

  async getNewHash(){
    let newHash='';
console.log("new hash here");

await this.state.contract.methods.getHash((this.state.id-1)).call().then((r) => {
  newHash=r;
  console.log(newHash);

  return this.setState({ memeHash: r })
  
});
this.setState({ memeHash: newHash });
console.log("new hash "+this.state.memeHash);
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            
            target="_blank"
            rel="noopener noreferrer"
          >
          
          </a>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a
                
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={`https://ipfs.infura.io/ipfs/${this.state.memeHash}`} />
                </a>
                <p>&nbsp;</p>
                <h2>Check Patients File</h2>
                <form onSubmit={this.onSubmit} >
                <input
        type="text"
        placeholder="Patient Id"
        value={this.state.id}
        autoFocus="autofocus"
        onChange={this.handleChange}
      />
                  <input type='submit' />
                </form>


                <h2>Doctors Notes</h2>
                <form onSubmit={this.onSubmitNotes} >
                <input
                placeholder="Notes"
        type="text"
        value={this.state.notes}
        autoFocus="autofocus"
        onChange={this.handleNoteChange}
      />
      
                  <input type='submit' />
                </form>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default Dock;