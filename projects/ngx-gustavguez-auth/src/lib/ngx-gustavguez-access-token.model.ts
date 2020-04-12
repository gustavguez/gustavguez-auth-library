export class NgxGustavguezAccessTokenModel {

	constructor(
		public token: string,
		public refreshToken: string,
		public expiration: Date) {
	}
}
