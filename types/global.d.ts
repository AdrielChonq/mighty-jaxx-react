declare namespace types {
  interface IJWTDeCode {
    id: string;
    email: string;
    iat: number;
    exp: number;
  }
  interface IProduct {
    _id: string;
    title: string;
    sku: string;
    imageID: string;
  }

  interface IAuth {
    isLoggedIn?: boolean;
    accessToken: string;
    refreshToken: string;
    firstName?: string;
    lastName?: string;
  }

  interface IModalMessage {
    isOpen: boolean;
    title: String;
    content: String;
    positiveLabel: String;
  }
}
