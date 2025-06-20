import * as quasar from 'quasar';
import * as capacitorDevice from '@capacitor/device';

export let getLanguage = async () => {
  return window.navigator.language.toUpperCase().slice(0, 2);
};

if (quasar.Platform.is.nativeMobile) {
  // import statement needs to be static and not list named imports
  // to be stubbed for web build

  const { Device } = capacitorDevice;
  getLanguage = async () => {
    const { value: languageCode } = await Device.getLanguageCode();

    return languageCode?.toUpperCase() || 'EN';
  };
}
