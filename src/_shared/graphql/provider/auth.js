import { gql } from "@apollo/client";

const REFRESH_TOKEN = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      success,
      errors,
      payload,
      token,
      refreshToken
    }
  }
`;

// 📌 Fonction pour récupérer les tokens
export const getToken = () => JSON.parse(localStorage.getItem('token')) || '';
export const getRefreshToken = () => JSON.parse(localStorage.getItem('refreshToken')) || '';

// 📌 Fonction pour rafraîchir le token
export const refreshToken = async (client) => {
  try {
    const refreshToken = getRefreshToken();
    const { data } = await client.mutate({
      mutation: REFRESH_TOKEN,
      variables: { refreshToken },
    });

    if (data.refreshToken.success) {
      const newToken = data.refreshToken.token;
      const newRefreshToken = data.refreshToken.refreshToken;

      localStorage.setItem('token', JSON.stringify(newToken));
      localStorage.setItem('refreshToken', JSON.stringify(newRefreshToken));

      return newToken;
    } else {
      console.error("Erreur lors du rafraîchissement du token:", data.refreshToken.errors);
      return null;
    }
  } catch (error) {
    console.error("Échec du rafraîchissement du token:", error);
    return null;
  }
};
