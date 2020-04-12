export class NgxGustavguezMeModel {
    constructor(id, username, firstName, lastName, profileImage, data) {
        this.id = id;
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.profileImage = profileImage;
        this.data = data;
    }
    fromJSON(json) {
        if (json) {
            this.id = json.id;
            this.username = json.username;
            this.firstName = json.firstName;
            this.lastName = json.lastName;
            this.profileImage = json.profileImage;
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWd1c3Rhdmd1ZXotbWUubW9kZWwuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtZ3VzdGF2Z3Vlei1hdXRoLyIsInNvdXJjZXMiOlsibGliL25neC1ndXN0YXZndWV6LW1lLm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sT0FBTyxvQkFBb0I7SUFFaEMsWUFDUSxFQUFXLEVBQ1gsUUFBaUIsRUFDakIsU0FBa0IsRUFDbEIsUUFBaUIsRUFDakIsWUFBcUIsRUFDckIsSUFBVTtRQUxWLE9BQUUsR0FBRixFQUFFLENBQVM7UUFDWCxhQUFRLEdBQVIsUUFBUSxDQUFTO1FBQ2pCLGNBQVMsR0FBVCxTQUFTLENBQVM7UUFDbEIsYUFBUSxHQUFSLFFBQVEsQ0FBUztRQUNqQixpQkFBWSxHQUFaLFlBQVksQ0FBUztRQUNyQixTQUFJLEdBQUosSUFBSSxDQUFNO0lBQ2QsQ0FBQztJQUVFLFFBQVEsQ0FBQyxJQUFTO1FBQ3hCLElBQUksSUFBSSxFQUFFO1lBQ1QsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO1lBQ2xCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUM5QixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7WUFDaEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1lBQzlCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztTQUN0QztJQUNGLENBQUM7Q0FDRCIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjbGFzcyBOZ3hHdXN0YXZndWV6TWVNb2RlbCB7XG5cblx0Y29uc3RydWN0b3IoXG5cdFx0cHVibGljIGlkPzogbnVtYmVyLFxuXHRcdHB1YmxpYyB1c2VybmFtZT86IHN0cmluZyxcblx0XHRwdWJsaWMgZmlyc3ROYW1lPzogc3RyaW5nLFxuXHRcdHB1YmxpYyBsYXN0TmFtZT86IHN0cmluZyxcblx0XHRwdWJsaWMgcHJvZmlsZUltYWdlPzogc3RyaW5nLFxuXHRcdHB1YmxpYyBkYXRhPzogYW55XG5cdCkgeyB9XG5cblx0cHVibGljIGZyb21KU09OKGpzb246IGFueSk6IHZvaWQge1xuXHRcdGlmIChqc29uKSB7XG5cdFx0XHR0aGlzLmlkID0ganNvbi5pZDtcblx0XHRcdHRoaXMudXNlcm5hbWUgPSBqc29uLnVzZXJuYW1lO1xuXHRcdFx0dGhpcy5maXJzdE5hbWUgPSBqc29uLmZpcnN0TmFtZTtcblx0XHRcdHRoaXMubGFzdE5hbWUgPSBqc29uLmxhc3ROYW1lO1xuXHRcdFx0dGhpcy5wcm9maWxlSW1hZ2UgPSBqc29uLnByb2ZpbGVJbWFnZTtcblx0XHR9XG5cdH1cbn1cbiJdfQ==