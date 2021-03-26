pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2; //use this to return struct 
import "./CarNetwork.sol";
// https://ethereum.stackexchange.com/questions/69077/how-can-i-return-dynamic-string-array-in-solidity
// https://docs.soliditylang.org/en/v0.5.2/abi-spec.html?highlight=abiencoderv2

contract Car {

    CarNetwork carNetwork;
    mapping(string => car) private carMap; //the string here refers to VIN car number
    mapping(string => bool) private carExistMap; 
    mapping (address => string[]) private ownerToCarsMap;
    mapping (address => string[]) private manufacturerToCarsMap;

    struct car {
        string carModel;
        address[] ownersList; // first is manufacturer, last is currOwner
        uint serviceRecordCount;
        mapping (uint => serviceRecord) serviceRecordMap;
    }
    struct serviceRecord {
        address createdBy;
        string createdOn; 
        string comment;
    }

    // new car template /////////////////
    address[] emptyOwnersArray;
    car newCar = car (
        "",
        emptyOwnersArray,
        0
    );
    // car return model /////////////////
    struct simplifiedCar {
        string carModel;
        string carVin;
    }
    //////////////////////////////////////

    event CreateCar(string vin, string carModel, address manufacturer);
    event TransferCar(string vin, address prevOwner, address currOwner);
    event AddServiceRecord(string vin, serviceRecord sr);
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

    modifier userExist(address user) {
        require(carNetwork.checkRole(user, "Owner") ||
        carNetwork.checkRole(user, "Manufacturer") ||
        carNetwork.checkRole(user, "Dealer") ||
        carNetwork.checkRole(user, "Workshop"), "Transfering to non-existing address");
        _;
    }

    modifier onlyCurrOwner(string memory vin) {
        uint arrLength = carMap[vin].ownersList.length;
        require(msg.sender == carMap[vin].ownersList[arrLength-1], "Require car's current owner");
        _;
    }

    function createCar(string memory newVin, string memory newCarModel, serviceRecord memory newServiceRecord) 
    public onlyRole("Manufacturer") {
        newCar.ownersList.push(msg.sender);
        ownerToCarsMap[msg.sender].push(newVin);
        manufacturerToCarsMap[msg.sender].push(newVin);

        newCar.carModel = newCarModel;
        carExistMap[newVin] = true;
        carMap[newVin] = newCar;

        emit CreateCar(newVin, carMap[newVin].carModel, carMap[newVin].ownersList[0]);

        internalAddServiceRecord(newVin, newServiceRecord);
    }

    function transferCar(string memory vin, address newOwner)
    public carExist(vin) onlyCurrOwner(vin) userExist(newOwner) {
        uint arrLength = carMap[vin].ownersList.length;
        address prevOwner = carMap[vin].ownersList[arrLength-1];
        carMap[vin].ownersList.push(newOwner);
        address currOwner = carMap[vin].ownersList[arrLength];

        for ( uint i = 0; i < ownerToCarsMap[msg.sender].length; i++){
            if (keccak256(abi.encodePacked(ownerToCarsMap[msg.sender][i])) == keccak256(abi.encodePacked(vin))){
                ownerToCarsMap[msg.sender][i] = ownerToCarsMap[msg.sender][ownerToCarsMap[msg.sender].length - 1]; //swap and delete
                delete ownerToCarsMap[msg.sender][ownerToCarsMap[msg.sender].length - 1];
                ownerToCarsMap[msg.sender].length--;
                break;
            }
        }
        ownerToCarsMap[newOwner].push(vin);
        emit TransferCar(vin, prevOwner, currOwner);
    }

    function addServiceRecord(string memory vin, serviceRecord memory newServiceRecord)
    public carExist(vin) onlyCurrOwner(vin) onlyRole("Workshop") {
        internalAddServiceRecord(vin, newServiceRecord);
    }

    function internalAddServiceRecord(string memory vin, serviceRecord memory newServiceRecord) 
    internal {
        uint numServiceRecord = carMap[vin].serviceRecordCount;
        carMap[vin].serviceRecordMap[numServiceRecord] = newServiceRecord;
        
        emit AddServiceRecord(vin, carMap[vin].serviceRecordMap[numServiceRecord]);
        carMap[vin].serviceRecordCount++;
    }

    function getOwnedCarsList() //for owner to get all currently owned cars (returns vin and model of each car)
    public view userExist(msg.sender) 
    returns(simplifiedCar[] memory) {
        string[] memory vinList =  ownerToCarsMap[msg.sender];
        simplifiedCar[] memory carList = new simplifiedCar[](vinList.length);
        for (uint i = 0; i< vinList.length; i++){
            carList[i] = simplifiedCar({
                carModel: carMap[vinList[i]].carModel,
                carVin: vinList[i]
            });
        }
        return carList;
    }

    function getManufacturedCarsList() //for manufacturer to get all previously manufactured cars (returns vin and model of each car)
    public view onlyRole("Manufacturer") 
    returns(simplifiedCar[] memory) {
        string[] memory vinList =  manufacturerToCarsMap[msg.sender];
        simplifiedCar[] memory carList = new simplifiedCar[](vinList.length);
        for (uint i = 0; i< vinList.length; i++){
            carList[i] = simplifiedCar({
                carModel: carMap[vinList[i]].carModel,
                carVin: vinList[i]
            });
        }
        return carList;
    }

    function getCarsByVinList(string[] memory vinList)
    public view userExist(msg.sender) 
    returns(simplifiedCar[] memory) {
        uint counter = 0;
        for (uint i = 0; i< vinList.length; i++){
            if(carExistMap[vinList[i]]){
               counter++;
            }
        }
        simplifiedCar[] memory carList = new simplifiedCar[](counter);
        for (uint i = 0; i< vinList.length; i++){
            if(carExistMap[vinList[i]]){
                carList[i] = simplifiedCar({
                    carModel: carMap[vinList[i]].carModel,
                    carVin: vinList[i]
                });
            }
        }
        return carList;
    }

    function getCarServiceRecordByVin(string memory vin)
    public view carExist(vin) userExist(msg.sender) 
    returns(serviceRecord[] memory) {
        serviceRecord[] memory serviceRecordList = new serviceRecord[](carMap[vin].serviceRecordCount);
        for (uint i = 0; i< carMap[vin].serviceRecordCount; i++){
            serviceRecordList[i] = serviceRecord({
                createdBy: carMap[vin].serviceRecordMap[i].createdBy,
                createdOn: carMap[vin].serviceRecordMap[i].createdOn,
                comment: carMap[vin].serviceRecordMap[i].comment
            });
        }
        return serviceRecordList;
    }
}