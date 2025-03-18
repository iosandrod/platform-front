import { defineStore } from 'pinia';
export type AuthKey = string | number;

/**
 * 插件配置
 */
export interface AuthPluginConfig {
  disableClass?: string;
  action?: 'hide' | 'disable';
  formatter?: (access: string) => string;
  [key: string | number]: any;
}


interface Operator {
  reject: (el: HTMLElement, access: string, config: AuthPluginConfig) => void;
  access: (el: HTMLElement, access: string, config: AuthPluginConfig) => void;
}



const AuthPlugin: any = {

};

export default AuthPlugin;
