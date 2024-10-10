import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';

import { FirebaseService } from 'src/shared/firebase/firebase.service';
import { MemberModel } from "../core/models";
import { FindMemberBy, MemberRepository } from "./interfaces";

@Injectable()
export class FirebaseMemberRepository implements MemberRepository {

    private readonly logger = new Logger(FirebaseMemberRepository.name);
    private readonly collectionName = 'members';

    constructor(
        private readonly firebaseService: FirebaseService
    ) { }

    async findOne(by: FindMemberBy, value: string): Promise<MemberModel> {
        const membersRef = this.firebaseService.firestore.collection(this.collectionName);
        let query: admin.firestore.DocumentData;

        switch (by) {
            case 'id':
                query = membersRef.where('memberId', '==', value);
                break;
            case 'username':
                query = membersRef.where('username', '==', value);
                break;
            case 'email':
                query = membersRef.where('email', '==', value);
                break;
            default:
                throw new Error('Invalid search criterion');
        }

        const snapshot = await query.get();
        if (snapshot.empty) return null;

        const doc = snapshot.docs[0];
        const memberData: MemberModel = doc.data();
        console.log(memberData);

        // MemberModel.fromPersistance({
        //     id: doc.id,
        //     nickname: memberData.nickname,
        //     email: memberData.email,
        //     emailVerifiedAt: memberData.emailVerifiedAt,
        //     emailVerifyExpiredAt: memberData.emailVerifyExpiredAt,
        //     auth: memberData.auth,
        //     socials: memberData.socials,
        //     tokens: memberData.tokens,
        //     agreedPolicies: memberData.agreedPolicies,
        //     fileGroupId: memberData.fileGroupId,
        //     createdAt: memberData.createdAt,
        //     updatedAt: memberData.updatedAt,
        //     deletedAt: memberData.deletedAt,
        // });

        return null;
    }

    async save(model: MemberModel): Promise<void> {
        const membersRef = this.firebaseService.firestore.collection(this.collectionName);

        console.log(model);
        // memberId를 문서 ID로 사용
        await membersRef.doc(model.id).set(model as MemberModel);

        this.logger.log(`Member with ID ${model.id} saved to Firestore.`);
    }
}
