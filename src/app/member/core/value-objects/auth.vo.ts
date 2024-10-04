export class AuthVO {
    readonly username: string;
    readonly password: string;
    readonly createdAt: Date;

    private constructor(prop: Partial<AuthVO>) {
        Object.assign(this, prop);
        Object.freeze(this);
    }

    static create(prop: Pick<AuthVO, 'username' | 'password'>) { 
        return new AuthVO({
            ...prop,
            createdAt: new Date()
        });
    }
}