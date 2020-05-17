pragma solidity 0.5.0;

contract Doc {
  string ipfsHash;
  uint public xyz=0;

  struct Patient{
        uint patientId;
        address payable patientAddress;
        string name;
        string filehash;
        string drNotes;
    }
    address payable owner;
    struct Doctor{
        uint doctorId;
        address doctorAddress;
        string name;
    }
    uint patientCount =0;
    uint doctorCount =0;

    Patient[] public patient;
    Doctor[] public doctor;
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

  constructor()public {
    owner = msg.sender;
  }

  function set(string memory x) public {
    xyz= getId(msg.sender)+1;
     
    ipfsHash = x;
  }

    function getId(address payable xyz1)public view  returns(uint)  {
        for(uint i=1;i<patientCount;i++)
        {
            if(patient[(i)].patientAddress == xyz1)
                {
                    return i;
                }
        }
    return 1;
  }

  function changeHeadDr(address payable _newDr)public onlyOwner {
    owner = _newDr;
  }

  function newPatient(string memory _name) public {
    patient.push(Patient(patientCount+1,msg.sender,_name,"",""));
    patientCount++;
  }

  function newDoctor(string memory _name) public {
    doctor.push(Doctor(doctorCount+1,msg.sender,_name));
    doctorCount++;
  }

  function doctorCheckup(uint _patientId)public view returns(string memory){
    return patient[(_patientId-1)].filehash;
  }

  function doctorNotes(uint _patientId,string memory _notes) public returns(string memory){
    patient[_patientId-1].drNotes = _notes;
  }

  function uploadFile(string memory _file) public {
           for(uint i=1;i<patientCount;i++)
        {
            if(patient[(i)].patientAddress == msg.sender)
                {
                    xyz = i;
                }
        }
   patient[xyz].filehash = _file;
  }

  function getHash(uint _id) public view returns (string memory) {
    return patient[_id].filehash;
    //return 'abce';
  }
}