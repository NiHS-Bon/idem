# Idem  
https://idem.com.au

## Abstract

Idem is a open source cross platform mobile application based on the Decentrlaized Identity Foundations DID protocol.

Each time an exchange requests an ID from a new user, the KYC provider charges the exchange a fee. Users are required to provide KYC information and have it verified for each and every exchange onboarding instead of being able to reuse verification from a trusted provider. By locally storing user's verified information with a cryptographic signature, we can enhance the customer onboarding experience and reduce costs incurred by vendors.

## The Tech
Idem uses a number of cryptographic protocols to sign and encrypt your data. PGP/GPG encryption is used to securely store data on your device, while the Ethereum elliptic curve is used to sign claims which conforms to the DID foundations verifiable claims schema.

## Intent
Idem is designed to be used by third parties, such as crypto exchanges, in two ways: 

1. Onboarding / Registering new users who do not have an account on the third party platform (User Story 1)
2. Onboarded users who have not completed any verification (User Story 2)

## Creating a profile on your Idem app

### Step 1: New Idem registration

User create a new local account on their mobile device using the Idem app, using their email address as a unique identifier.

### Step 2: New private key
The app will automatically create a 256-bit private key on the device or allow users to import a mnemonic seed phrase based on the bitcoin BIP39 standard. This will be used to sign and verify requests using ESDCA to third parties.

### Step 3: Upload data

On the mobile app users can choose certain types of claims to verify such as 18+, Date of Birth or Address. User are required to substantiate any of those claims with supporting evidence such as a government issued document, utilities bill etc. The documents are cached in the local storage of the device along with a keccak 256 hash and signed by the ESDCA curve.

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
```text
As a frustrated crypto customer, 
I want to onboard to the exchange via the Idem app, 
So that I don't have to re-supply all my information again and again and again!
```

```text
Given a user who has downloaded the app,  
And has verified their claims on the app,  
When they visit exchange.com registration page,  
And they scan the QR code via the app,  
And Ok on the app,  
Then they are registered on exchange.com,
And their ID is verfied,  
And they are redirected to exchange.com's home page.
```

![Screenshot from 2021-10-01 17-30-42](https://user-images.githubusercontent.com/8411406/135585023-31ff96da-33f6-440d-92f6-e01a965cd0ad.png)


### Implementation
### Step 1:  Onboarding on Third-Party Sites

The site "exchange.com" creates a unique deeplink url with the url schema `did://` along with the claims it requires:

* Domain (mandatory)
* Call back path (mandatory)
* Nonce as UUID (mandatory)
* An array of claims required

Eg: `did://callback=domain.com&callback=/verify?nonce=8b5c66c0-bceb-40b4-b099-d31b127bf7b3&claims=[0x01]`

### Step 2:  Posting the signed data to the exchange
The user will then receive confirmation alert on the device with the claims the exchange is requesting as specified in the deeplink.  Should the user accept that request for claims, the app will the post the claims in the following DID schema.

```json

```

## User Story 2:  Verify an already registered user

Often a site will email a user once they have created an account with an email address and password.  At this step, the site could also pass an unsigned url for the users to scan with their Idem app to validate their email and other claims.

A QR code deeplink is a URL providing the claims required by site, along with a call back url.  

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
Then their ID is posted from the app to exchange.com's API,
And their Idem signature is vefified,
And their personal data is updated at exchange.com
```

## Verify these claims
These claims are then verified by a third-party KYC vendors who return an X-509 SSL certificate signed JSON object that can then be used again.  Each vendor has a different process for onboarding and the app will maintain these different business requirements.

![Verification Sequence](/assets/did.verification.sequence.svg)


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
https://en.bitcoin.it/wiki/Seed_phrase
https://docs.microsoft.com/en-us/dotnet/api/system.security.claims.claim?view=net-5.0
Transactions on the Ethereum Test Network "Kovan" will be signed with the ETH account `0xE4ed9ceF6989CFE9da7c1Eec8c2299141dD9e7cC`
