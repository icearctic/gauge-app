import * as quasar from 'quasar';
import * as capacitorToast from '@capacitor/toast';
import type { Toast } from '@capacitor/toast';

export async function toast(text: string) {
  await showToast({ text });
};


let showToast: typeof Toast.show = async (options) => {
  quasar.Notify.create(options.text);
};

if (quasar.Platform.is.nativeMobile) {
  // import statement needs to be static and not list named imports
  // to be stubbed for web build
  const { Toast } = capacitorToast;

  showToast = Toast.show;
}
