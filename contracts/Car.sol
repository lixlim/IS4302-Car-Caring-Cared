pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2; //use this to return struct 
// https://ethereum.stackexchange.com/questions/69077/how-can-i-return-dynamic-string-array-in-solidity
// https://docs.soliditylang.org/en/v0.5.2/abi-spec.html?highlight=abiencoderv2

contract Car {

    mapping(string => car) carMap; //the string here refers to VIN car number
    struct car {
        string carModel;
        address[] owners; // first is manufacturer, last is currOwner
        string[] carPartsList; //the list of keys for the carPartsMapping
        mapping (string => serviceRecord[]) carPartsServiceRecordMapping;
    }
    struct serviceRecord {
        address createdBy;
        string createdOn; 
        string carPart;
        string model;
        string batchNo;
        string comment;
    }

    constructor() public {
    }
    
    // function createCar() public onlyManufacturer(msg.sender) {
        
    // }
    
    // function getCar(string vin) public view returns(car){
        
    // }
    
    // function getCurrentOwner(string vin) public view returns(address){
        
    // }
    
    // function getOwnerList(string vin) public view returns(string[] memory){
        
    // }
    
    // function getCarPartsList(string vin) public view returns(carPartsList[] memory){
        
    // }
    
    // function getCarManufacturer(string vin) public view returns(address){
        
    // }
    
    // function updateOwner() public {
        
    // }
    
    // function addServiceRecord(string vin, string carPart, ......) public { 
        
    // }

}