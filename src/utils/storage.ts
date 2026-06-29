import type { IMenuItem } from "../types/auth";

const TOKEN_KEY = 'afml_session_token';
const USER_NAME_KEY ='afml_user_name';
const USER_ENROLL_KEY ='afml_user_enroll';
const USER_MENU_KEY ='afml_user_menu';

export const storage ={
    getToken: () => localStorage.getItem(TOKEN_KEY),
    setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),

    getUserName: () => localStorage.getItem(USER_NAME_KEY) || 'Employee',
    setUserName: (name: string) => localStorage.setItem(USER_NAME_KEY, name),

    getUserEnroll: () => localStorage.getItem(USER_ENROLL_KEY) || '',
    setUserEnroll: (enroll: string) => localStorage.setItem(USER_ENROLL_KEY, enroll),

    getMenuTree: (): IMenuItem[] => {
    const menu = localStorage.getItem(USER_MENU_KEY);
    return menu ? (JSON.parse(menu) as IMenuItem[]) : [];
    },
    setMenuTree: (menu: IMenuItem[]) => localStorage.setItem(USER_MENU_KEY, JSON.stringify(menu)),

    clearAll: () => localStorage.clear(),
}