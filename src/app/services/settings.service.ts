import { EventEmitter, Injectable } from '@angular/core';

// Set here the default value; if there's none, set as undefined and specify key type.
export class SettingsProperties {
    fastSwitching = false;
    stageFontScale = 100;
    chordsFontScale = 100;
    bigDisplayButtons = false;
    darkTheme = false;
}

export interface SettingsPropertiesItem<SP extends keyof SettingsProperties, SV = SettingsProperties[SP]> {
    property: SP;
    value: SV;
}

const LOCAL_STORAGE_PREFIX = 'OpenLP-';

@Injectable()
export class SettingsService {
    constructor() {
        window.addEventListener('storage', this._handleStorageEvent);
    }

    defaultSettingsPropertiesInstance = new SettingsProperties();

    settingChanged$: EventEmitter<SettingsPropertiesItem<any, any>> = new EventEmitter<any>();
    listenersCache: {[key in keyof Partial<SettingsProperties>]: EventEmitter<any>} = {};

    getAll(): Partial<SettingsProperties> {
        const output: Partial<SettingsProperties> = {};
        for (const key of Object.keys(this.defaultSettingsPropertiesInstance)) {
            const value = this.get(key as keyof SettingsProperties);
            if (value !== undefined) {
                output[key] = value;
            }
        }
        return output;
    }

    get<SP extends keyof SettingsProperties, SV = SettingsProperties[SP]>(property: SP): SV | undefined {
        let propertyValue: any = localStorage.getItem(LOCAL_STORAGE_PREFIX + property);
        if ((propertyValue === undefined || propertyValue === null)
            && this.defaultSettingsPropertiesInstance.hasOwnProperty(property)
        ) {
            propertyValue = this.defaultSettingsPropertiesInstance[property];
            this.set(property, propertyValue);
        }

        if (propertyValue) {
            return JSON.parse(propertyValue);
        }

        return undefined;
    }

    set<SP extends keyof SettingsProperties, SV = SettingsProperties[SP]>(property: SP, value: SV) {
        if (value === undefined) {
            localStorage.removeItem(LOCAL_STORAGE_PREFIX + property);
            this._emitEvent(property, undefined);
        } else {
            localStorage.setItem(LOCAL_STORAGE_PREFIX + property, JSON.stringify(value));
            this._emitEvent(property, value);
        }
    }

    remove<SP extends keyof SettingsProperties>(property: SP) {
        this.set(property, undefined);
    }

    onPropertyChanged<SP extends keyof SettingsProperties, SV = SettingsProperties[SP]>(
        property: SP
    ): EventEmitter<SV> {
        if (!this.listenersCache[property]) {
            this.listenersCache[property] = new EventEmitter<SV>();
        }

        return this.listenersCache[property];
    }

    protected _handleStorageEvent = (event: StorageEvent) => {
        if (event.storageArea === localStorage) {
            this._emitEvent(event.key.replace(LOCAL_STORAGE_PREFIX, '') as any, JSON.parse(event.newValue));
        }
    };

    protected _emitEvent<SP extends keyof SettingsProperties, SV = SettingsProperties[SP]>(property: SP, value: SV) {
        this.settingChanged$.emit({property, value});
        this.listenersCache?.[property]?.emit(value);
    }
}
