
import { Store } from "pullstate";

export const appState = new Store({
    user: {
      firstName: '',
      lastName: '',
      acceptedTnC: false,
    },
    preferences: {
      isDarkMode: false,
      pushNotifications: false,
      language: 'sw',
    },
});

