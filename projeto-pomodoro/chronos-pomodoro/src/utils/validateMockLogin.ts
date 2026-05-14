import { MOCK_PASSWORD, MOCK_USERNAME } from "../constants/mockCredentials";

/**
 * Compara os valores de login e senha digitados pelo usuário com os valores do mock
 * 
 * @param username valor que o usuaruio ira digitar no campo de login
 * @param password valor que o usuaruio ira digitar no campo de senha
 * @returns true se der certo com o mock e false se der errado
 */
export function validateMockLogin(username: string, password: string): boolean {
  return username.trim() === MOCK_USERNAME && password.trim() === MOCK_PASSWORD;
}