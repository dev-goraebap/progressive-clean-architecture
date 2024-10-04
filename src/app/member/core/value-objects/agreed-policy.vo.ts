export class AgreedPolicyVO {
    readonly policyId: string;
    readonly agreedAt: Date;

    private constructor(prop: Partial<AgreedPolicyVO>) {
        Object.assign(this, prop);
        Object.freeze(this);
    }

    static create(policyId: string) {
        return new AgreedPolicyVO({
            policyId,
            agreedAt: new Date(),
        });
    }
}