export interface _LoginResponseDTO {
  jwtToken: string;
  message: string;
}

export interface _LoginRequestDTO {
  email: string;
  password: string;
}

export const jwtTokenKey = "jwtToken";
