import { LocalStorageService } from 'angular-2-local-storage';
import { ApiService } from 'ngx-gustavguez-core';
import { Observable } from 'rxjs';
import { NgxGustavguezConfigModel } from './ngx-gustavguez-config.model';
import { NgxGustavguezAccessTokenModel } from './ngx-gustavguez-access-token.model';
import { NgxGustavguezLastMeModel } from './ngx-gustavguez-last-me.model';
import { NgxGustavguezMeModel } from './ngx-gustavguez-me.model';
export declare class NgxGustavguezAuthService {
    private storageService;
    private apiService;
    private me;
    private config;
    private lastMe;
    private accessToken;
    private onSessionStateChange;
    private onMeParsed;
    private onMeChanged;
    constructor(storageService: LocalStorageService, apiService: ApiService);
    setConfig(config: NgxGustavguezConfigModel): void;
    getLastMe(): NgxGustavguezLastMeModel;
    getAccessToken(): NgxGustavguezAccessTokenModel;
    getMe(): NgxGustavguezMeModel;
    isLogged(): boolean;
    getOnSessionStateChange(): Observable<boolean>;
    getOnMeChanged(): Observable<NgxGustavguezMeModel>;
    getOnMeParsed(): Observable<any>;
    login(loginUsername: string, loginPassword: string): Observable<boolean>;
    requestMe(): Observable<NgxGustavguezMeModel>;
    refreshToken(): Observable<NgxGustavguezAccessTokenModel>;
    loadSession(): Observable<boolean>;
    logout(): void;
    checkAndNotifyMeState(): void;
    updateMe(me: NgxGustavguezMeModel): void;
    private parseAccessToken;
}
