# Apple Wallet Biz Card

Digital business card generator for Apple Wallet. Created for Sunghyun Cho ([cho.sh](https://cho.sh)).

## Apple Wallet Pass Setup

To generate valid Apple Wallet passes, you need to set up the following certificates:

1. **Pass Type ID certificate**: Obtain this from the Apple Developer portal.
2. **Private key**: Exported as `.p12` from Keychain Access, then converted to PEM format.
3. **Apple WWDR G4 certificate**: Available from Apple's certificate authority page.
4. **Base64 Encoding**: All certificates and keys must be base64 encoded before being added to the environment variables.
