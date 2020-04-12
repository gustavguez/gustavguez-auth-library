export class NgxGustavguezAuthAccessTokenModel {

	constructor(
		public token: string,
		public refreshToken: string,
		public expiration: Date) {
	}
}
