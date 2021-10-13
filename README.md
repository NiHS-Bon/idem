# Idem 
https://idem.com.au

## Abstract

Idem is an open source cross platform mobile application based on the Decentralised Identity Foundations DID protocol.

Each time an exchange requests an ID verifycation from a user, the provider charges the exchange a fee.  Further, users are required to provide KYC information and have it verified for each and every onboarding, instead of a portable, reusable verification from a trusted provider.  By locally storing user's verified information, we can enhance the customer onboarding experience and reduce costs incurred by Vendors.

Idem has two workflows, 

1. Onboarding / Registering new users (user story 1)
2. Onboarded users who have not completed any verification (user story 2)

Kovan transactions will be signed with the ETH account `0xE4ed9ceF6989CFE9da7c1Eec8c2299141dD9e7cC`

### Step 1: New Idem registration

User onboards to the app via their Mobile number.

### Step 2: New private key
The app will automatically create a 256-bit private key on the device.  This will be used to sign messages using ESDCA to third parties.

### Step 3: Upload data

On the mobile application the user can choose certain types of claims to verify, such as 18+, Date of Birth or Address.  The user is then required to substantiate any of those claims with supporting evidence such as a government issued document, utilities bill or such. The documents are stored in the local storage of the device along with a keccak 256 hash.

Meta data is stored in a JSON object:

```json
{
    "claims": [{
        "key": "0x02",
        "type": "dob",
        "value": "1979-04-29"
    }]
}
```
Note:  See the Microsoft claims class for .net https://docs.microsoft.com/en-us/dotnet/api/system.security.claims.claim?view=net-5.0

## User Story 1:  Onboarding a new user

```
As a frustrated customer, 
I want to onboard via the Idem app, 
So that I don't have to re-supply all my information.
```

```text
Given a user who has downloaded the app,  
And has verified their claims,  
When they visit exchange.com,  
And they scan the QR code via the app,  
And Ok on the app,  
Then they are registered and ID verfied,  
And taken to the exchange home page.  
```

## User Story 2:  Verify an already registered user

```text
As an existing unverfied customer of exchange.com,
I want to verify my KYC requirements via IDEM,
So that I don't need to complete yet another KYC process.
```

```text
Given a user who has downloaded the app,  
And has already verified their claims,  
When they visit exchange.com,  
And they scan the QR code via the app,  
And OK to sharing data on the app to exchange.com,  
Then their ID is posted from the app to exchange.com's API
And their Idem signature is vefified,
And their persona data is updated at exchange.com
```

## Verify these claims
These claims are then verified by a third-party KYC vendors who return an X-509 SSL certificate signed JSON object that can then be used again.  Each vendor has a different process for onboarding and the app will maintain these different business requirements.

![Verification Sequence](/assets/did.verification.sequence.svg)

## Implementation on Third-Party sites
### Step 1:  Onboarding on Third-Party Sites

The exchange "exchange.com" creates a unique URL with the url schema `did://` with the claims the exchange requires for:

* Call back URL (mandatory)
* Nonce as UUID (mandatory)
* A list of claims required

Eg: `did://callback=exchange.com/verify?nonce=8b5c66c0-bceb-40b4-b099-d31b127bf7b3&claims=0x01`

### Step 2:  Posting the signed data to the exchange
The user will then receive confirmation alert on the device with the claims the exchange is requesting.

The app will the post the claims in the following schema.

```json

```

## Appendix

### Routes

### Registration Schema


### Table of claims

| Key | Subject | Mnemonic | Standard | Description |
|---|---|---|---|---|
| 0x00 | Full Name | fullname | | Clients Full Name |
| 0x01 | Birth Year | birthyear | YYYY ISO 8601 | Clients Year of Birth |
| 0x02 | Date of Birth | dob | YYYY-MM-DD ISO 8601 | Clients Date of Birth | 
| 0x03 | Email | email | email | Clients email address  | 
| 0x04 | Address | address | Physical Address | Clients pyhsical address | 
| 0x05 | Mobile Number | mobilenumber | Mobile Number | Clients mobile number | 
| 0x06 | 18+ | eighteenplus | 18 Plus | 18 Plus | 

### Table of claims data types

| Name | Value |
| --- | --- |
| decimal | |
| boolean | |
| integer | |
| email | |
| date | |
| datetime |

### Table of documents

| Key | Document | Details
| --- | --- | ---
| 0x00 | Australian birth certificate | A full birth certificate in your name or former name issued by State Authority of Births, Deaths and Marriages. We cannot accept birth extracts or birth cards.
| 0x01 | Australian driver licence | A current driver licence with your photo issued in your name. This includes physical and digital driver licences, current learner permits, and provisional licences. 

### Trusted ID verification providers

A smart contract contains a struct of trusted providers.  The providers can only be granted or revoked by an independent third party, such as Blockchain Australia, DataZoo etc.

### ERC 1812 Example

```
struct ID {
	address issuer;
	address subject;
	uint256 validFrom;
	uint256 validTo;
}
```

Issuer: The ID provider.  This could be Blockchain Australia
Subject:  See table


### ERC 780 Example
```
contract EthereumClaimsRegistry {

    mapping(address => mapping(address => mapping(bytes32 => bytes32))) public registry;

    event ClaimSet(
        address indexed issuer,
        address indexed subject,
        bytes32 indexed key,
        bytes32 value,
        uint updatedAt);

    event ClaimRemoved(
        address indexed issuer,
        address indexed subject,
        bytes32 indexed key,
        uint removedAt);

    // create or update claims
    function setClaim(address subject, bytes32 key, bytes32 value) public {
        registry[msg.sender][subject][key] = value;
        emit ClaimSet(msg.sender, subject, key, value, now);
    }

    function setSelfClaim(bytes32 key, bytes32 value) public {
        setClaim(msg.sender, key, value);
    }

    function getClaim(address issuer, address subject, bytes32 key) public view returns(bytes32) {
        return registry[issuer][subject][key];
    }

    function removeClaim(address issuer, address subject, bytes32 key) public {
        require(msg.sender == issuer);
        delete registry[issuer][subject][key];
        emit ClaimRemoved(msg.sender, subject, key, now);
    }
}
```

## References

https://www.servicesaustralia.gov.au/individuals/topics/confirm-your-identity/29166
