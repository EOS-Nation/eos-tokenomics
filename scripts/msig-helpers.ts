export interface Action {
    account: string;
    name: string;
    authorization: { actor: string, permission: string }[];
    data: string;
}

export const transaction: {expiration: string, actions: Action[]} = {
    expiration: "2025-01-01T00:00:00",
    actions: [],
}