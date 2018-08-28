pragma solidity ^0.4.24;

contract Rating {

  // Circuit Breaker

  // check if the contract is stopped
  bool private stopped = false;

  // Store owner's address
  address private owner;

  modifier isAdmin() {
      require(msg.sender == owner);
      _;
  }

  // Activate/Deactivate the contract by Admin
  function toggleContractActive() isAdmin public{
      stopped = !stopped;
  }

  // modifiers for circuit breaker
  modifier stopInEmergency { if (!stopped) _; }
  modifier onlyInEmergency { if (stopped) _; }

  // Teacher Model
  struct Teacher {
    uint id;
    string name;
    string image;
    uint age;
    string department;
    string rank;
    uint rating;
    uint ratingCount;
  }

  // Raters Model
  struct RateModel{
    bool t1;
    bool t2;
    bool t3;
    bool t4;
  }

  // Store raters
  mapping(address => RateModel) public raters;

  // Store teachers
  mapping(uint => Teacher) public teachers;

  // Store Teachers Count
  uint public teachersCount;

  // Store total rates
  uint public totalRates;

  // rated event
  event ratedEvent(uint indexed _teacherId);

  // Constructor add four teachers
  function Rating() public {
    // Assign owner's address
    owner = msg.sender;

    // Add teachers
    addTeacher(1, "Ahmad","images/ahmad.jpg", 30, "Software Engineering", "Master");
    addTeacher(2, "Sarah","images/sarah.jpg", 40, "Software Engineering", "Phd");
    addTeacher(3, "Kabir","images/kabir.jpg", 35, "Network", "Master");
    addTeacher(4, "John","images/john.jpg", 50, "Database", "Phd");
  }

  // function used to add the teachers to the teachers mapping
  function addTeacher(uint _id, string _name, string _image, uint _age, string _dept, string _rank) private {
    teachersCount++;
    teachers[teachersCount] = Teacher(_id, _name, _image, _age, _dept, _rank, 0, 0);
  }

  function rate(uint _teacherId, uint value) stopInEmergency public{
    // require a valid rater
    bool rated;
    if(_teacherId==1){
      rated = raters[msg.sender].t1;
    }
    if(_teacherId==2){
      rated = raters[msg.sender].t2;
    }
    if(_teacherId==3){
      rated = raters[msg.sender].t3;
    }
    if(_teacherId==4){
      rated = raters[msg.sender].t4;
    }

    // require that user has not already rated
    require(!rated);

    // require a valid teacher
    require(_teacherId>0 && _teacherId<=teachersCount);

    // record that rater has rated
    if(_teacherId==1){
      raters[msg.sender].t1 = true;
    }
    if(_teacherId==2){
      raters[msg.sender].t2 = true;
    }
    if(_teacherId==3){
      raters[msg.sender].t3 = true;
    }
    if(_teacherId==4){
      raters[msg.sender].t4 = true;
    }

    // increment the rating for the teacher
    teachers[_teacherId].rating+=value;

    // update the rating count
    teachers[_teacherId].ratingCount++;

    // fire rated event
    emit ratedEvent(_teacherId);
  }

}
