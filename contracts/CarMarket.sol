pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;
import "./Car.sol";

contract CarMarket {
    
    Car car;
    string[] public carListings; //array of VINs
    mapping(string => uint32) public carPrices;
    
    struct listedCar{
        string carModel;
        string carVin;
        uint32 carPrice;
        address carOwner;
    }

    constructor(Car c) public {
        car = c; 
    }   

    event listCar(string vin);
    event unlistCar(string vin);
    event Debug(string str);
    
    modifier carExist(string memory vin) {
        require(car.checkCarExists(vin), "Vin number does not exist");
        _;
    }

    modifier onlyCurrOwner(string memory vin) {
        require(msg.sender == car.getCurrentOwner(vin), "Require car's current owner");
        _;
    }

    function list(string memory vin, uint32 price) public onlyCurrOwner(vin) carExist(vin){
        require(price >0, "Price must be > 0");
        carListings.push(vin);
        carPrices[vin] = price; 
        emit listCar(vin);
    }

    function unlist(string memory vin) public onlyCurrOwner(vin) carExist(vin) {
        //remove vin from carListings
        for ( uint i = 0; i < carListings.length; i++){
            if (keccak256(abi.encodePacked(carListings[i])) == keccak256(abi.encodePacked(vin))){
                carListings[i] = carListings[carListings.length - 1]; //swap and delete
                delete carListings[carListings.length - 1];
                carListings.length--;
                break;
            }
        }
        delete carPrices[vin];
        emit unlistCar(vin);
        
    }

    function checkPrice(string memory vin) public view carExist(vin) returns(uint32) {
        return carPrices[vin];      
    }

    function getAllListedCars() public view returns(listedCar[] memory) {
        listedCar[] memory carList = new listedCar[](carListings.length);
        for (uint i = 0; i < carListings.length; i++){
            string memory vin = carListings[i];
            carList[i] = listedCar({
                carModel: car.getCar(vin).carModel, 
                carVin: vin, 
                carPrice: carPrices[vin],
                carOwner: car.getCurrentOwner(vin)
            });
        }
        return carList;
    }
    
}