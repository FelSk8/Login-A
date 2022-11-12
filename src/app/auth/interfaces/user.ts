export interface UserI {
    id?: number;
    email?: string;
    password?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface UserResponseI extends UserI {
    message: string;  
    token: string;
    status: number;
}
