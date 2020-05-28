import { ModuleConfig } from '@graphql-modules/core';
import { Inject, Injectable } from '@graphql-modules/di';
import { UsersModel } from '@masteryo/masteryo-gql-shared-models';

interface IUser {
  id: string;
  firstName: string;
  createdDate: number;
  modifiedDate: number;
  groupId: string;
  userStatus: string;
  verificationStatus: string;
}


@Injectable()
export class AuthProvider {

  private mapper;

  constructor(@Inject(ModuleConfig) private config) {
    this.mapper = this.config.mapper;
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
