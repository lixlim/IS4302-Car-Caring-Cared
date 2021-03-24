pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2; //use this to return struct 
import "./CarNetwork.sol";
// https://ethereum.stackexchange.com/questions/69077/how-can-i-return-dynamic-string-array-in-solidity
// https://docs.soliditylang.org/en/v0.5.2/abi-spec.html?highlight=abiencoderv2

contract Car {

    CarNetwork carNetwork;
    mapping(string => car) carMap; //the string here refers to VIN car number
    mapping(string => bool) carExistMap; 
    struct car {
        string carModel;
        address[] ownersList; // first is manufacturer, last is currOwner
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
    // new car template /////////////////
    address[] emptyOwnersArray;
    string[] emptyCarPartsListArray;
    car newCar = car(
        "",
        emptyOwnersArray,
        emptyCarPartsListArray
    );
    //////////////////////////////////////

    event CreateCar(string vin, string carModel, address manufacturer, uint numCarParts);
    event TransferCar(string vin, address prevOwner, address currOwner);
    event Debug(string str);

    constructor(CarNetwork cn) public {
        carNetwork = cn;
    }

    modifier onlyRole(string memory role) {
        require(carNetwork.checkRole(msg.sender, role), "You do not have the access right");
        _;
    }

    modifier carExist(string memory vin) {
        require(carExistMap[vin], "Vin number does not exist");
        _;
    }

    modifier onlyCurrOwner(string memory vin) {
        uint arrLength = carMap[vin].ownersList.length;
        require(msg.sender == carMap[vin].ownersList[arrLength-1], "Require car's current owner");
        _;
    }
    
    function createCar(string memory newVin, string memory newCarModel, 
    serviceRecord[] memory newCarParts) 
    public onlyRole("Manufacturer") {
        newCar.carModel = newCarModel;
        newCar.ownersList.push(msg.sender);
        carMap[newVin] = newCar;
        carExistMap[newVin] = true;
        for(uint i = 0; i < newCarParts.length; i++){
            carMap[newVin].carPartsList.push(newCarParts[i].carPart);
            carMap[newVin].carPartsServiceRecordMapping[newCarParts[i].carPart].push(newCarParts[i]);
        }
        emit CreateCar(newVin, carMap[newVin].carModel, carMap[newVin].ownersList[0], newCarParts.length);
    }

    function transferCar(string memory vin, address newOwner)
    public carExist(vin) onlyCurrOwner(vin) {
        uint arrLength = carMap[vin].ownersList.length;
        address prevOwner = carMap[vin].ownersList[arrLength-1];
        carMap[vin].ownersList.push(newOwner);
        address currOwner = carMap[vin].ownersList[arrLength];
        emit TransferCar(vin, prevOwner, currOwner);
    }

    // function getCar(string memory vin) public view returns (car memory){
    //     return carMap[vin];
    // }

    // function workShopAddServiceRecord(string memory vin, string memory createdOn,
    // string memory carPart, string memory model, string memory batchNo, string memory comment) 
    // public carExist(vin) onlyRole("Workshop") onlyCurrOwner(vin) {
 
    // }
    
}