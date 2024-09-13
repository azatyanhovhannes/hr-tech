import { create } from "zustand";
import { useMutation, gql } from "@apollo/client";
import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
	uri: "https://api.escuelajs.co/graphql",
	cache: new InMemoryCache(),
});

const LOGIN_MUTATION = gql`
	mutation Login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			access_token
			refresh_token
		}
	}
`;

const REFRESH_TOKEN_MUTATION = gql`
	mutation RefreshToken($refreshToken: String!) {
		refreshToken(refreshToken: $refreshToken) {
			access_token
			refresh_token
		}
	}
`;

interface AuthState {
	accessToken: string | null;
	refreshToken: string | null;
	login: (email: string, password: string) => Promise<void>;
	logout: () => void;
	refreshAccessToken: () => Promise<void>;
}

export const useAuth = create<AuthState>(set => ({
	accessToken: null,
	refreshToken: null,

	login: async (email: string, password: string) => {
		try {
			const { data } = await client.mutate({
				mutation: LOGIN_MUTATION,
				variables: { email, password },
			});

			console.log(data);

			if (data?.login) {
				const { access_token, refresh_token } = data.login;
				set({ accessToken: access_token, refreshToken: refresh_token });
				localStorage.setItem("accessToken", access_token);
				localStorage.setItem("refreshToken", refresh_token);
			}
		} catch (error) {
			console.error("Ошибка при входе:", error);
		}
	},

	logout: () => {
		set({ accessToken: null, refreshToken: null });
		localStorage.removeItem("accessToken");
		localStorage.removeItem("refreshToken");
	},

	refreshAccessToken: async () => {
		const storedRefreshToken = localStorage.getItem("refreshToken");
		if (!storedRefreshToken) return;

		try {
			const { data } = await client.mutate({
				mutation: REFRESH_TOKEN_MUTATION,
				variables: { refreshToken: storedRefreshToken },
			});

			if (data?.refreshToken) {
				const { access_token, refresh_token } = data.refreshToken;
				set({ accessToken: access_token, refreshToken: refresh_token });
				localStorage.setItem("accessToken", access_token);
				localStorage.setItem("refreshToken", refresh_token);
			}
		} catch (error) {
			console.error("Ошибка при обновлении токена:", error);
		}
	},
}));
