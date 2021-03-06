# 🚘 Car Car-ing Car-ed 🚘
Blockchain-based solution that allows accurate car history records to be stored immutably in a trusted system and be made accessible to everyone. This aims to solve the information asymmetry that exists in the used car market by providing a single source of truth, which is contributed collectively by all actors in the car ecosystem, including car manufacturers, dealers and servicing workshops. With the transparency of car records, we have also incorporated an open marketplace which helps to facilitate the buying and selling of cars.

## Installation 
1. Clone repository
2. npm install
```
npm i
```

## Running
1. Run ganache from command line
```
ganache-cli -p 8545
```
2. In a separate terminal, navigate to project directory and run 
```
truffle deploy
```
3. Navigate to `/client` subdirectory of project and run
```
npm start
```
4. When the metamask extension pop-up appears on the browser, select to connect to Localhost 8545, then proceed to import account using seed phase as provided in the ganache command line.
5. Allow app access to all accounts.

## Account roles and authorisation on app
For demonstration purposes, below is a list of predefined roles for each account as reflected in metamask extension, and their corresponding login credentials.

The password for all accounts are `12345678`.

> **Account 2** - Car owner
> buyer1@gmail.com
> 
> **Account 5** - Car owner
> buyer4@gmail.com
> 
> **Account 6** - Car manufacturer  
> manufacturer@car.com  
> 
> **Account 8** - Car dealer  
> dealer@car.com
> 
> **Account 9** - Car servicing workshop  
> workshop@car.com  


