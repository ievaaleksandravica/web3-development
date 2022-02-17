pragma solidity ^0.4.18;

contract Greetings {
  string message;

  function Greetings() public {
    message = "I am ready!";
  }

  function setGreetings(string _message) public {
    message = _message;
  }

  function getGreetings() public view returns (string){
    return message;
  }
}
