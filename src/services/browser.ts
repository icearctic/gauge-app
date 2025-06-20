import * as quasar from 'quasar';
import * as capacitorBrowser from '@capacitor/browser';

export let browserOpen = async (url: string) => {
  window.open(url);
};

if (quasar.Platform.is.nativeMobile) {
  // import statement needs to be static and not list named imports
  // to be stubbed for web build
  const { Browser } = capacitorBrowser;

  browserOpen = async (url: string) => {
    await Browser.open({ url })
  };
}
