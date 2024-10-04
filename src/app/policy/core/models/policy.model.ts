export class PolicyModel {
    readonly id: string;
    readonly title: string;
    readonly contentUrl: string;
    readonly createdAt: Date;
    readonly deletedAt: Date;

    private constructor(prop: Partial<PolicyModel>) {
        Object.assign(this, prop);
        Object.freeze(this);
    }

    static create(prop: Pick<PolicyModel, 'id' | 'title' | 'contentUrl'>) {
        return new PolicyModel({
            ...prop,
            createdAt: new Date(),
            deletedAt: null,
        });
    }
}