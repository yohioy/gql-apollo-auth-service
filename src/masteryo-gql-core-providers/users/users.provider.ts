import { ModuleSessionInfo } from "@graphql-modules/core";
import { Injectable, ProviderScope } from "@graphql-modules/di";
import { UsersModel, IUser } from './users.model';

@Injectable({
    scope: ProviderScope.Session,
})

export class UsersProvider {

    protected mapper;

    constructor(private moduleSessionInfo: ModuleSessionInfo) {
        this.mapper = moduleSessionInfo.session.request.dataMapper;
    }

    async getUsers () {
        const iterator = this.mapper.scan(UsersModel);

        const data: any = [];

        for await (const record of iterator) {
            let item = {
                id: record.id,
                firstName: record.firstName,
                verificationStatus: record.verificationStatus,
                userStatus: record.userStatus,
                groupId: record.groupId
            };

            data.push(item);
        }
        return data;
    }

    async getUser (id: string) {
        const user = new UsersModel();
        user.id = id;
        return this.mapper.get(user);
    }


    async getUserByEmail (email: string) {
        console.log(email);
    }

    async createUser (data: IUser): Promise<any> {

        const user = new UsersModel();
        user.id = data.id;
        user.firstName = data.firstName;
        user.createdDate = data.createdDate;
        user.modifiedDate = data.modifiedDate;
        user.groupId = data.groupId;
        user.userStatus = data.userStatus;
        user.verificationStatus = data.verificationStatus;

        return this.mapper.put(user);
    }

    async updateVerifiedUser (id: string, verificationStatus: string): Promise<any> {
        const user = new UsersModel();
        user.id = id;
        user.verificationStatus = verificationStatus;
        return this.mapper.update(user, {onMissing: 'skip'});
    }
}
