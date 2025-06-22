import { _LoginResponseDTO, jwtTokenKey } from "./models";
import { credential } from "../../models/constants";

const serverUrl = Cypress.env("serverUrl");
const loginEndPointUrl = `${serverUrl}/api/auth/login`;
export const login = (
  email: string = credential.email,
  password: string = credential.password
): Cypress.Chainable<_LoginResponseDTO> => {
  return cy
    .request<_LoginResponseDTO>({
      method: "POST",
      url: loginEndPointUrl,
      body: {
        email,
        password,
      },
    })
    .then((response) => {
      expect(response.status).to.eq(200);
      return response.body;
    })
    .then((loginResponseDTO) => {
      localStorage.setItem(jwtTokenKey, loginResponseDTO.jwtToken);
    });
};
