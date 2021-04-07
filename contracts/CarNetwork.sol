pragma solidity ^0.5.0;

contract CarNetwork {
       
    address admin;
    struct user {
        string role;
    }
    mapping(address => user) private userMap;
    mapping(address => bool) private userExistMap;

    event Register(address newAddress, string role);

    constructor(address admin_Address) public {
        admin = admin_Address;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "This action requires admin");
        _;
    }
    
    function register(address newUserAddress, string memory newRole) public onlyAdmin(){
        require(!userExistMap[newUserAddress], "User already registered in system.");
        user memory newUser = user(
            ""
        );
        string memory role;
        if (keccak256(abi.encodePacked((newRole))) == keccak256(abi.encodePacked(("Owner")))) {
            newUser.role = "Owner";
            role = "Owner";
        }
        else if (keccak256(abi.encodePacked((newRole))) == keccak256(abi.encodePacked(("Manufacturer")))) {
            newUser.role = "Manufacturer";
            role = "Manufacturer";
        }
        else if (keccak256(abi.encodePacked((newRole))) == keccak256(abi.encodePacked(("Dealer")))) {
            newUser.role = "Dealer";
            role =  "Dealer";
        }
        else if (keccak256(abi.encodePacked((newRole))) == keccak256(abi.encodePacked(("Workshop")))) {
            newUser.role = "Workshop";
            role = "Workshop";
        }
        else {
            revert("Role does not exist");
        }
        userExistMap[newUserAddress] = true;
        userMap[newUserAddress] = newUser;
        emit Register(newUserAddress, role);
    }

    function checkRole(address checkAddress, string memory userRole) public view returns(bool) {
        require(userExistMap[checkAddress], "User not registered in system.");
        if (keccak256(abi.encodePacked((userMap[checkAddress].role))) == keccak256(abi.encodePacked((userRole)))) {
            return true;
        } else {
            return false;
        }
    }

    function returnRoleWithAccount(address checkAddress) public view returns(string memory) {
        require(userExistMap[checkAddress], "User not registered in system.");
        return userMap[checkAddress].role;
    }

}