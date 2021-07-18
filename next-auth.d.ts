import "next-auth";

declare module "next-auth" {
	interface Session {
		user: {
			id: string,
			image: string,
			name: string
		}
	}
}
