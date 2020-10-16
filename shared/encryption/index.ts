import crypto from "crypto";

export const Encryption = {

    test: (token: string, publicKey: string, privateKey: string, passphrase: string) => {
        const key = crypto.randomBytes(32);
        const iv = crypto.randomBytes(16);

        const encryptedKey = Encryption.publicEncrypt(key, publicKey);
        const decryptedKey = Encryption.privateDecrypt(encryptedKey, privateKey, passphrase);

        const encryptedIv = Encryption.publicEncrypt(iv, publicKey);
        const decryptedIv = Encryption.privateDecrypt(encryptedIv, privateKey, passphrase);

        const encryptedToken = Encryption.cipheriv(token, key, iv);
        const decryptedToken = Encryption.decipheriv(encryptedToken, key, iv);

        const log = [
            {
                key: key.toString("base64"),
                encryptedKey: encryptedKey,
                decryptedKey: decryptedKey
            },
            {
                iv: iv.toString("base64"),
                encryptedIv: encryptedIv,
                decryptedIv: decryptedIv
            },
            {
                token: token,
                encryptedToken: encryptedToken,
                decryptedToken: decryptedToken
            }
        ]

        console.log(log);

    },
    encryptToken: (token: string, encodedPublicKey: string) => {

        const publicKey = Buffer.from(encodedPublicKey, 'base64').toString('ascii');

        const key = crypto.randomBytes(32);
        const iv = crypto.randomBytes(16);

        const encryptedKey = Encryption.publicEncrypt(key, publicKey);
        const encryptedIv = Encryption.publicEncrypt(iv, publicKey);
        const encryptedToken = Encryption.cipheriv(token, key, iv);

        return `${encryptedKey}:${encryptedIv}:${encryptedToken}`;

    },
    decryptToken: (data: string, encodedPrivateKey: string, passphrase: string) => {

        const privateKey = Buffer.from(encodedPrivateKey, 'base64').toString('ascii');

        const tokenChunk = data.split(":");
        const encryptedKey = tokenChunk[0];
        const encryptedIv = tokenChunk[1];
        const token = tokenChunk[2];

        const decryptedKey = Encryption.privateDecrypt(encryptedKey, privateKey, passphrase);
        const decryptedIv = Encryption.privateDecrypt(encryptedIv, privateKey, passphrase);
        const decryptedToken = Encryption.decipheriv(token, decryptedKey, decryptedIv);

        return decryptedToken;
    },
    cipheriv: (token: string, key: Buffer, iv: Buffer) => {

        let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), Buffer.from(iv));
        let encryptedTokenBuffer = cipher.update(token);
        encryptedTokenBuffer = Buffer.concat([encryptedTokenBuffer, cipher.final()]);

        return encryptedTokenBuffer.toString('hex');

    },
    decipheriv: (token: string, key: Buffer, iv: Buffer) => {

        let encryptedText = Buffer.from(token, 'hex');
        let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), Buffer.from(iv));
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();

    },
    publicEncrypt: (data: Buffer, publicKey: string) => {

        const encrypted = crypto.publicEncrypt(
            {
                key: publicKey,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: "sha256"
            },
            Buffer.from(data)
        );

        return encrypted.toString("base64");

    },
    privateDecrypt: (encryptedData: string, privateKey: string, passphrase: string) => {

        const decrypted = crypto.privateDecrypt(
            {
                key: privateKey,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: "sha256",
                passphrase: passphrase
            },
            Buffer.from(encryptedData, 'base64')
        );
        return decrypted;
    }


};