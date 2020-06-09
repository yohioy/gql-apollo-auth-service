import { DynamoDbSchema, DynamoDbTable } from '@aws/dynamodb-data-mapper';

//@todo

export interface IUser {
    id: string | undefined;
    firstName: string | undefined;
    createdDate: number | undefined;
    modifiedDate: number | undefined;
    groupId: string | undefined;
    userStatus: string | undefined;
    verificationStatus: string | undefined;
}

export class UsersModel implements IUser {
    id;
    userStatus;
    firstName;
    groupId;
    createdDate;
    modifiedDate;
    verificationStatus;
}

Object.defineProperties(UsersModel.prototype, {
    [DynamoDbTable]: {
        value: 'users'
    },
    [DynamoDbSchema]: {
        value: {
            id: {
                type: 'String',
                keyType: 'HASH'
            },
            firstName: {
                type: 'String',
                indexKeyConfigurations: {
                    firstNameIndex: 'HASH'
                }
            },
            userStatus: {
                type: 'String',
                indexKeyConfigurations: {
                    userStatusIndex: 'HASH'
                }
            },
            groupId: { type: 'String' },
            createDate: { type: 'Date' },
            modifiedDate: { type: 'Date' },
            verificationStatus: { type: 'String' }
        }
    }
});

